const {EleventyRenderPlugin} = require("@11ty/eleventy");
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("src/assets");
    
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addFilter("getYear", (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear();
    });

    return {
        dir:{
            input: 'src',
            includes: '_includes',
            output: process.env.SITE_DIR,
            data: "_data"
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        HTMLTemplateElement: 'njk',
        dataTemplateEngine: 'njk'
    };
}