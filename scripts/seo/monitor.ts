#!/usr/bin/env npx tsx
/**
 * SEO Monitoring Script for Arteva
 *
 * Usage:
 *   npx tsx scripts/seo/monitor.ts
 *   npx tsx scripts/seo/monitor.ts --keywords-only
 *   npx tsx scripts/seo/monitor.ts --lighthouse-only
 *
 * Requirements:
 *   - SERPAPI_API_KEY environment variable (get free key at serpapi.com)
 */

import {config} from './config';
import {execSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const RESULTS_DIR = path.join(__dirname, 'results');
const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

interface KeywordResult {
  keyword: string;
  position: number | null;
  url: string | null;
  title: string | null;
  competitors: Array<{domain: string; position: number}>;
}

interface LighthouseResult {
  url: string;
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  lcp: number;
  cls: number;
}

interface MonitoringReport {
  timestamp: string;
  domain: string;
  keywords: KeywordResult[];
  lighthouse: LighthouseResult[];
  summary: {
    keywordsTracked: number;
    keywordsRanking: number;
    avgPosition: number | null;
    lighthouseAvgPerf: number;
    lighthouseAvgSeo: number;
  };
}

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, {recursive: true});
}

async function checkKeywordRanking(keyword: string): Promise<KeywordResult> {
  console.log(`  Checking: "${keyword}"`);

  if (!SERPAPI_KEY) {
    console.log('    [SKIP] No SERPAPI_API_KEY set');
    return {
      keyword,
      position: null,
      url: null,
      title: null,
      competitors: []
    };
  }

  try {
    const params = new URLSearchParams({
      q: keyword,
      location: 'Morocco',
      google_domain: 'google.ma',
      gl: 'ma',
      hl: 'fr',
      num: '30',
      api_key: SERPAPI_KEY
    });

    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();

    if (!data.organic_results) {
      return {keyword, position: null, url: null, title: null, competitors: []};
    }

    let artevaPosition: number | null = null;
    let artevaUrl: string | null = null;
    let artevaTitle: string | null = null;
    const competitors: Array<{domain: string; position: number}> = [];

    for (let i = 0; i < data.organic_results.length; i++) {
      const result = data.organic_results[i];
      const domain = new URL(result.link).hostname.replace('www.', '');
      const position = i + 1;

      // Check if it's Arteva
      if (domain === config.domain || domain === `www.${config.domain}`) {
        artevaPosition = position;
        artevaUrl = result.link;
        artevaTitle = result.title;
      }

      // Track competitors
      if (config.competitors.some(c => domain.includes(c.replace('www.', '')))) {
        competitors.push({domain, position});
      }
    }

    const positionStr = artevaPosition ? `#${artevaPosition}` : 'Not found';
    console.log(`    Position: ${positionStr}`);

    return {
      keyword,
      position: artevaPosition,
      url: artevaUrl,
      title: artevaTitle,
      competitors: competitors.slice(0, 5)
    };
  } catch (error) {
    console.log(`    [ERROR] ${error}`);
    return {keyword, position: null, url: null, title: null, competitors: []};
  }
}

async function runLighthouseAudit(urlPath: string): Promise<LighthouseResult | null> {
  const fullUrl = `${config.baseUrl}${urlPath}`;
  console.log(`  Auditing: ${fullUrl}`);

  try {
    const outputPath = `/tmp/lh-${Date.now()}.json`;
    execSync(
      `npx -y lighthouse "${fullUrl}" --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --only-categories=performance,seo,accessibility,best-practices 2>/dev/null`,
      {timeout: 120000}
    );

    const report = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    fs.unlinkSync(outputPath);

    const result: LighthouseResult = {
      url: urlPath,
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      seo: Math.round((report.categories.seo?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
      lcp: report.audits['largest-contentful-paint']?.numericValue || 0,
      cls: report.audits['cumulative-layout-shift']?.numericValue || 0
    };

    console.log(`    Perf: ${result.performance} | SEO: ${result.seo} | A11y: ${result.accessibility}`);
    return result;
  } catch (error) {
    console.log(`    [ERROR] Lighthouse failed`);
    return null;
  }
}

async function generateReport(
  keywordResults: KeywordResult[],
  lighthouseResults: LighthouseResult[]
): Promise<MonitoringReport> {
  const rankedKeywords = keywordResults.filter(k => k.position !== null);
  const positions = rankedKeywords.map(k => k.position as number);
  const avgPosition = positions.length > 0
    ? Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) / 10
    : null;

  const avgPerf = lighthouseResults.length > 0
    ? Math.round(lighthouseResults.reduce((a, b) => a + b.performance, 0) / lighthouseResults.length)
    : 0;

  const avgSeo = lighthouseResults.length > 0
    ? Math.round(lighthouseResults.reduce((a, b) => a + b.seo, 0) / lighthouseResults.length)
    : 0;

  return {
    timestamp: new Date().toISOString(),
    domain: config.domain,
    keywords: keywordResults,
    lighthouse: lighthouseResults,
    summary: {
      keywordsTracked: keywordResults.length,
      keywordsRanking: rankedKeywords.length,
      avgPosition,
      lighthouseAvgPerf: avgPerf,
      lighthouseAvgSeo: avgSeo
    }
  };
}

function printReport(report: MonitoringReport) {
  console.log('\n' + '='.repeat(60));
  console.log('SEO MONITORING REPORT - ARTEVA');
  console.log('='.repeat(60));
  console.log(`Date: ${new Date(report.timestamp).toLocaleString('fr-FR')}`);
  console.log(`Domain: ${report.domain}`);
  console.log('');

  // Keywords summary
  console.log('KEYWORD RANKINGS');
  console.log('-'.repeat(40));
  console.log(`Keywords tracked: ${report.summary.keywordsTracked}`);
  console.log(`Keywords ranking (top 30): ${report.summary.keywordsRanking}`);
  console.log(`Average position: ${report.summary.avgPosition || 'N/A'}`);
  console.log('');

  // Top rankings
  const ranked = report.keywords
    .filter(k => k.position !== null)
    .sort((a, b) => (a.position || 100) - (b.position || 100));

  if (ranked.length > 0) {
    console.log('Best rankings:');
    ranked.slice(0, 5).forEach(k => {
      console.log(`  #${k.position} - "${k.keyword}"`);
    });
  }
  console.log('');

  // Not ranking
  const notRanked = report.keywords.filter(k => k.position === null);
  if (notRanked.length > 0) {
    console.log(`Not in top 30 (${notRanked.length} keywords):`);
    notRanked.slice(0, 5).forEach(k => {
      console.log(`  - "${k.keyword}"`);
    });
  }
  console.log('');

  // Lighthouse summary
  console.log('LIGHTHOUSE SCORES');
  console.log('-'.repeat(40));
  console.log(`Average Performance: ${report.summary.lighthouseAvgPerf}/100`);
  console.log(`Average SEO: ${report.summary.lighthouseAvgSeo}/100`);
  console.log('');

  report.lighthouse.forEach(lh => {
    const perfIcon = lh.performance >= config.thresholds.performance ? '✅' : '⚠️';
    const seoIcon = lh.seo >= config.thresholds.seo ? '✅' : '⚠️';
    console.log(`${lh.url}`);
    console.log(`  ${perfIcon} Perf: ${lh.performance} | ${seoIcon} SEO: ${lh.seo} | A11y: ${lh.accessibility}`);
  });

  console.log('\n' + '='.repeat(60));
}

async function main() {
  const args = process.argv.slice(2);
  const keywordsOnly = args.includes('--keywords-only');
  const lighthouseOnly = args.includes('--lighthouse-only');

  console.log('🔍 ARTEVA SEO MONITOR');
  console.log('====================\n');

  let keywordResults: KeywordResult[] = [];
  let lighthouseResults: LighthouseResult[] = [];

  // Keyword tracking
  if (!lighthouseOnly) {
    console.log('📊 Checking keyword rankings...\n');
    if (!SERPAPI_KEY) {
      console.log('⚠️  SERPAPI_API_KEY not set. Get a free key at https://serpapi.com\n');
      console.log('   export SERPAPI_API_KEY=your_key_here\n');
    }

    for (const keyword of config.keywords) {
      const result = await checkKeywordRanking(keyword);
      keywordResults.push(result);
      // Rate limiting
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Lighthouse audits
  if (!keywordsOnly) {
    console.log('\n🚀 Running Lighthouse audits...\n');
    for (const pagePath of config.pagesToAudit.slice(0, 3)) { // Limit to 3 pages for speed
      const result = await runLighthouseAudit(pagePath);
      if (result) {
        lighthouseResults.push(result);
      }
    }
  }

  // Generate and save report
  const report = await generateReport(keywordResults, lighthouseResults);

  const filename = `report-${new Date().toISOString().split('T')[0]}.json`;
  const filepath = path.join(RESULTS_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`\n📁 Report saved: ${filepath}`);

  // Print summary
  printReport(report);

  // Also save latest.json for easy access
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'latest.json'),
    JSON.stringify(report, null, 2)
  );
}

main().catch(console.error);
