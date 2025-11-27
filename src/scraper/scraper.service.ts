import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import * as https from 'https'; // Import thêm https
import { WantedCriminal } from '../wanted-criminals/entities/wanted-criminal.entity';
import { WantedCriminalsService } from '../wanted-criminals/wanted-criminals.service';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);
    // Encode URL path để tránh lỗi ký tự đặc biệt
    private readonly baseUrl = 'https://truyna.bocongan.gov.vn';

    // Tạo agent để bypass lỗi SSL thường gặp ở các site .gov.vn cũ
    private readonly httpsAgent = new https.Agent({  
        rejectUnauthorized: false 
    });

    constructor(
        private readonly wantedCriminalsService: WantedCriminalsService,
    ) { }

    async scrapeWantedCriminals(maxPages: number = 10, limit?: number): Promise<Partial<WantedCriminal>[]> {
        const criminals: Partial<WantedCriminal>[] = [];
        const effectiveMaxPages = limit ? 1000 : maxPages;

        this.logger.log(`Starting scrape job. Max pages: ${effectiveMaxPages}, Limit: ${limit || 'Unlimited'}`);

        try {
            for (let page = 1; page <= effectiveMaxPages; page++) {
                this.logger.log(`Scraping page ${page}...`);

                const pageCriminals = await this.scrapePage(page);
                
                if (pageCriminals.length === 0) {
                    this.logger.warn(`No criminals found on page ${page}. Stopping.`);
                    break;
                }

                // Xử lý limit
                let itemsToProcess = pageCriminals;
                if (limit) {
                    const remaining = limit - criminals.length;
                    if (remaining <= 0) break;
                    if (pageCriminals.length > remaining) {
                        itemsToProcess = pageCriminals.slice(0, remaining);
                    }
                }

                // --- TỐI ƯU DB: Chạy song song (Parallel) thay vì tuần tự ---
                const savePromises = itemsToProcess.map(async (criminal) => {
                    try {
                        await this.wantedCriminalsService.createOrUpdate(criminal);
                    } catch (error) {
                        this.logger.error(`Failed to save ${criminal.name}: ${error.message}`);
                    }
                });

                await Promise.all(savePromises);
                // -----------------------------------------------------------

                criminals.push(...itemsToProcess);

                if (limit && criminals.length >= limit) {
                    this.logger.log(`Reached limit of ${limit}. Stopping.`);
                    return criminals;
                }

                // Delay ngẫu nhiên từ 1s - 2s để giống người thật hơn
                const randomDelay = Math.floor(Math.random() * 1000) + 1000;
                await this.delay(randomDelay);
            }

            this.logger.log(`Scraping completed. Total: ${criminals.length}`);
            return criminals;

        } catch (error) {
            this.logger.error(`Fatal error scraping: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async scrapePage(page: number): Promise<Partial<WantedCriminal>[]> {
        try {
            // Sử dụng encodeURI cho các path có tiếng Việt
            const path = page === 1 
                ? '/Trang-chủ' 
                : `/Trang-chủ/ctl/chitiet/mid/1091?page=${page}`;
            
            const url = encodeURI(`${this.baseUrl}${path}`);

            const response = await axios.get(url, {
                timeout: 30000,
                httpsAgent: this.httpsAgent, // Quan trọng: Bypass SSL check
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Referer': this.baseUrl, // Thêm referer để bypass anti-bot cơ bản
                },
            });

            const $ = cheerio.load(response.data);
            const criminals: Partial<WantedCriminal>[] = [];

            $('table tbody tr').each((index, element) => {
                if (index === 0) return; 

                const $row = $(element);
                const cells = $row.find('td');

                // Kiểm tra kỹ hơn để tránh row rác
                if (cells.length >= 7) {
                     const criminal = this.parseTableRow($, cells);
                     if (criminal) criminals.push(criminal);
                }
            });

            return criminals;

        } catch (error) {
            this.logger.error(`Error scraping page ${page}: ${error.message}`);
            return [];
        }
    }

    private parseTableRow($: cheerio.CheerioAPI, cells: cheerio.Cheerio<any>): Partial<WantedCriminal> | null {
        try {
            // Lấy text an toàn hơn
            const getText = (idx: number) => $(cells[idx]).text().replace(/\s+/g, ' ').trim();

            const nameLink = $(cells[1]).find('a');
            const fullName = nameLink.text().trim() || getText(1);

            if (!fullName) return null;

            const birthYearStr = getText(2);
            // Regex để lấy đúng 4 số năm (VD: "1990" trong chuỗi rác)
            const yearMatch = birthYearStr.match(/\d{4}/);
            const birthYear = yearMatch ? parseInt(yearMatch[0]) : undefined;

            return {
                name: fullName.toUpperCase(), // Chuẩn hóa tên viết hoa
                birthYear: birthYear,
                address: getText(3) || undefined,
                parents: getText(4) || undefined,
                crime: getText(5),
                decisionNumber: getText(6) || undefined,
                issuingUnit: getText(7) || undefined,
            };

        } catch (error) {
            // Log warning nhẹ hơn, không cần stack trace
            this.logger.warn(`Skipping row due to parse error: ${error.message}`);
            return null;
        }
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}