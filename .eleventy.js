const {EleventyRenderPlugin} = require("@11ty/eleventy");

module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("src/assets");
    
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    return {
        dir:{
            input: 'src',
            includes: '_includes',
            output: 'public',
            data: "_data"
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        HTMLTemplateElement: 'njk',
        dataTemplateEngine: 'njk'
    };
}