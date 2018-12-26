
module.exports = {
    add(pages, base) {
        let pagesXML = `
        <url>
            <loc>http://www.fernbacher.com/</loc>
        </url>
        <url>
            <loc>http://www.fernbacher.com/posts</loc>
        </url>
        <url>
            <loc>http://www.fernbacher.com/projects</loc>
        </url>
        <url>
            <loc>http://www.fernbacher.com/info</loc>
        </url>
         `;
        if(pages.length > 1) {
            for(p of pages) {
                pagesXML += `
                <url>
                    <loc>http://www.fernbacher.com/${base}${p.url}</loc>
                </url>
                `
            };
        }
        
    
        let sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
    
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
    
        </urlset> `;
    }
}
