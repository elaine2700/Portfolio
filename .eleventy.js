
module.exports = function(eleventyConfig){
    eleventyConfig.addPassthroughCopy("src/assets");
    
    return {
        dir:{
            input: 'src',
            includes: '_includes',
            output: '_site',
            data: "_data"
        },
        templateFormats: ['md', 'njk', 'html'],
        markdownTemplateEngine: 'njk',
        HTMLTemplateElement: 'njk',
        dataTemplateEngine: 'njk'
    };
}