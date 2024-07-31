const {EleventyRenderPlugin} = require("@11ty/eleventy");
const dotenv = require('dotenv');
dotenv.config();

module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("src/assets");
    
    eleventyConfig.addPlugin(EleventyRenderPlugin);

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