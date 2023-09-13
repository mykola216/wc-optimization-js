const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path'); // Додайте цей рядок
const express = require("express");
const app = express();

var ClosureCompiler = require('google-closure-compiler').compiler;

const site_correct =
{
    id: 234252666,
    site_url: 'sht.nik',
    secret_key: 'w04856309485gj03w9485g',
};

const port = 5000;
app.listen(port, (req, res) => {
    console.log(`Server start on port ${port}`);
});

app.use(express.json());
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to this server!!!'
    })
});
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to this api server!!!'
    })
});
app.post('/api/homemobile', (req, res) => {
    const body = req.body;
    let error_text = [];
    if (req.body.id != site_correct.id) {
        error_text += 'ERROR id... ';
    }
    if (req.body.site_url != site_correct.site_url) {
        error_text += 'ERROR site_url... ';
    }
    if (req.body.secret_key != site_correct.secret_key) {
        error_text += 'ERROR secret_key...';
    }
    if (req.body.site_url_page == '') {
        error_text += 'ERROR site_url_page... ';
    }

    if (error_text.length) {
        res.status(201).json({
            error_text
        })
        res.end();
    } else {
        let site_url_page = req.body.site_url_page;
        generateCoverageParMobile(req.body.site_url_page, req.body.page_send_cov).then(([json, page_send_cov]) => {
            res.status(200).json({
                page_send_cov: page_send_cov,
                status: 200,
                message: json
            })
            res.end();
        }).catch(error => {
            // /movies or /categories request failed
            res.status(203).json({
                error: error
            })
            res.end();
        });
    }
});
app.post('/api/homedesctop', (req, res) => {
    const body = req.body;
    let error_text = [];
    if (req.body.id != site_correct.id) {
        error_text += 'ERROR id... ';
    }
    if (req.body.site_url != site_correct.site_url) {
        error_text += 'ERROR site_url... ';
    }
    if (req.body.secret_key != site_correct.secret_key) {
        error_text += 'ERROR secret_key...';
    }
    if (req.body.site_url_page == '') {
        error_text += 'ERROR site_url_page... ';
    }

    if (error_text.length) {
        res.status(201).json({
            error_text
        })
        res.end();
    } else {
        let site_url_page = req.body.site_url_page;
        generateCoveragePar(req.body.site_url_page, req.body.page_send_cov).then(([json, page_send_cov]) => {
            res.status(200).json({
                page_send_cov: page_send_cov,
                status: 200,
                message: json
            })
            res.end();
        }).catch(error => {
            // /movies or /categories request failed
            res.status(203).json({
                error: error
            })
            res.end();
        });
    }
});

async function generateCoverageParMobile(site_url_page = "", page_send_cov = '') {
    try {
        //console.log(pageurl);

        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
	    // Set screen size
        await page.setViewport({ width: 360, height: 576 });
        
         // Navigate the page to a URL
        await page.goto(site_url_page);
        
        await page.waitForSelector('.min-footer');
        
        //await page.coverage.startCSSCoverage();
        // Start recording JS and CSS coverage data
        await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage()
        ]);

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }); 


        //await page.hover('li.menu_block_top_custom_all.menu-item.menu-item-type-custom.menu-item-object-custom.wd-event-hover.menu-item-has-children');
        //await page.hover('li.menu-item.menu-item-type-taxonomy.menu-item-object-product_cat');
        //await page.hover("li.menu-item.menu-item-type-taxonomy");
        //await page.hover('li.item-with-label.item-label-primary>a');
        //await page.hover('.wd-header-cart');
        // await page.hover('.promo-banner.banner-default.banner-hover-zoom.color-scheme-.banner-btn-size-default.banner-btn-style-default.cursor-pointer');
        //await page.hover('.product-element-top.wd-quick-shop');
        //await page.hover('.wd-button-wrapper.text-center');
        //await page.hover('a.btn.btn-style-bordered.btn-style-rectangle');
        //await page.hover('.flickity-button.flickity-prev-next-button');
        //await page.click('.flickity-button.flickity-prev-next-button');
        //await page.click('#cn-accept-cookie');
        
        //await page.hover('li.dot:nth-of-type(even)');
        //await page.click('li.dot:nth-of-type(even)');
        //await page.hover('a.elementor-button.elementor-button-link.elementor-size-smі');
        //await page.hover('a.scrollToTop.button-show');

        const coverageCSS = await page.coverage.stopCSSCoverage();
        const coverageJs = await page.coverage.stopJSCoverage();
        
        // Save the converted obj to string
        const jsoncss = JSON.stringify(coverageCSS);
        const jsonjs = JSON.stringify(coverageJs);

        /* Converted css optimization (works with the obj) */ 
        const data_css = coverageCSS;
        let covered_css = '';
          for (let entry of data_css) { 
            for (let text_all_css of entry.ranges) {
              covered_css += entry.text.slice(text_all_css.start, text_all_css.end) + "\n";
            }    
        }        

        /*
        const flags = {
            jsCode: [{src: './page-site/js_my/jquery.flexslider.min.js'}],
        };
          const out = ClosureCompiler(flags);
          console.log (flags);
        */  

        /*
        //start JS
        var inputString = '';
                var findme = "jquery.flexslider.min.js";
                const data_js = coverageJs;
                let covered_js = '';

                for (let entry of data_js) { 
                    inputString = entry.url;
                    //console.log (typeof(entry.url)); 
                        if ( inputString.indexOf(findme) > -1 ) {
                            console.log (inputString);
                        }                    
                    //for (let text_all_css of entry.ranges) {
                    //covered_css += entry.text.slice(text_all_css.start, text_all_css.end) + "\n";
                    //}                    
                }

        //end JS
        */
        /* END Converted css optimization */
        /*
        if (data.url.includes(combined_css)) {
            for (const range of data.ranges) {
                const length = range.end - range.start;
                css.push(data.text.substring(range.start, range.start + length));
            }
            break;
        }
        */
        await browser.close();       
        console.log('mob end_convert page ' + page_send_cov);
        return [covered_css, page_send_cov]; 
    } catch (error) {
        console.log(error.response.body);
    }
};


async function generateCoveragePar(site_url_page = "", page_send_cov = '') {
    try {
        //console.log(pageurl);

        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
	    // Set screen size
        await page.setViewport({ width: 1366, height: 768 });
        
         // Navigate the page to a URL
        await page.goto(site_url_page);
        
        await page.waitForSelector('.min-footer');
        
        //await page.coverage.startCSSCoverage();
        // Start recording JS and CSS coverage data
        await Promise.all([
            page.coverage.startJSCoverage(),
            page.coverage.startCSSCoverage()
        ]);

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }); 


        await page.hover('li.menu_block_top_custom_all.menu-item.menu-item-type-custom.menu-item-object-custom.wd-event-hover.menu-item-has-children');
        await page.hover('li.menu-item.menu-item-type-taxonomy.menu-item-object-product_cat');
        await page.hover("li.menu-item.menu-item-type-taxonomy");
        await page.hover('li.item-with-label.item-label-primary>a');
        await page.hover('.wd-header-cart');
        // await page.hover('.promo-banner.banner-default.banner-hover-zoom.color-scheme-.banner-btn-size-default.banner-btn-style-default.cursor-pointer');
        await page.hover('.product-element-top.wd-quick-shop');
        await page.hover('.wd-button-wrapper.text-center');
        await page.hover('a.btn.btn-style-bordered.btn-style-rectangle');
        await page.hover('.flickity-button.flickity-prev-next-button');
        //await page.click('.flickity-button.flickity-prev-next-button');
        //await page.click('#cn-accept-cookie');
        
        await page.hover('li.dot:nth-of-type(even)');
        //await page.click('li.dot:nth-of-type(even)');
        //await page.hover('a.elementor-button.elementor-button-link.elementor-size-smі');
        //await page.hover('a.scrollToTop.button-show');

        const coverageCSS = await page.coverage.stopCSSCoverage();
        const coverageJs = await page.coverage.stopJSCoverage();
        
        // Save the converted obj to string
        const jsoncss = JSON.stringify(coverageCSS);
        const jsonjs = JSON.stringify(coverageJs);

        /* Converted css optimization (works with the obj) */ 
        const data_css = coverageCSS;
        let covered_css = '';
          for (let entry of data_css) { 
            for (let text_all_css of entry.ranges) {
              covered_css += entry.text.slice(text_all_css.start, text_all_css.end) + "\n";
            }    
        }        

        /*
        const flags = {
            jsCode: [{src: './page-site/js_my/jquery.flexslider.min.js'}],
        };
          const out = ClosureCompiler(flags);
          console.log (flags);
        */  

        /*
        //start JS
        var inputString = '';
                var findme = "jquery.flexslider.min.js";
                const data_js = coverageJs;
                let covered_js = '';

                for (let entry of data_js) { 
                    inputString = entry.url;
                    //console.log (typeof(entry.url)); 
                        if ( inputString.indexOf(findme) > -1 ) {
                            console.log (inputString);
                        }                    
                    //for (let text_all_css of entry.ranges) {
                    //covered_css += entry.text.slice(text_all_css.start, text_all_css.end) + "\n";
                    //}                    
                }

        //end JS
        */
        /* END Converted css optimization */
        /*
        if (data.url.includes(combined_css)) {
            for (const range of data.ranges) {
                const length = range.end - range.start;
                css.push(data.text.substring(range.start, range.start + length));
            }
            break;
        }
        */
        await browser.close();       
        console.log('end_convert page ' + page_send_cov);
        return [covered_css, page_send_cov]; 
    } catch (error) {
        console.log(error.response.body);
    }
};
   



/*
const flags = {
  jsCode: [{src: 'const x = 1 + 2;'}],
};
const out = ClosureCompiler(flags);
console.info(out.ClosureCompiler);  // will print 'var x = 3;\n'
*/




