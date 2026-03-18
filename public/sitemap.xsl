<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 2rem; background-color: #fdfdfd; }
          h1 { color: #111; font-size: 24px; margin-bottom: 0.5rem; }
          p { color: #555; font-size: 14px; margin-top: 0; margin-bottom: 1.5rem; }
          table { border-collapse: collapse; width: 100%; max-width: 1200px; background-color: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th { background-color: #2563eb; color: #fff; text-align: left; padding: 12px 16px; font-size: 14px; font-weight: 600; }
          tr { border-bottom: 1px solid #f1f5f9; }
          tr:last-child { border-bottom: none; }
          tr:hover { background-color: #f8fafc; }
          td { padding: 12px 16px; font-size: 14px; color: #475569; }
          td a { color: #2563eb; text-decoration: none; font-weight: 500; }
          td a:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 4px 8px; background-color: #e2e8f0; border-radius: 4px; font-size: 12px; color: #475569; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML Sitemap, intended for consumption by search engines like Google and Bing. This layout renders it for human readability.<br/>
        <strong>Total URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong></p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Priority</th>
              <th>Change Freq</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td><a href="{sitemap:loc}" target="_blank"><xsl:value-of select="sitemap:loc"/></a></td>
                <td><span class="badge"><xsl:value-of select="sitemap:priority"/></span></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
