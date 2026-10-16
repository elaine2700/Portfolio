const {EleventyRenderPlugin} = require("@11ty/eleventy");
const dotenv = require('dotenv');
dotenv.config();

const { compileGraph } = require('./packages/strata-graph/src/index');

module.exports = function(eleventyConfig){
    // Compile strata-graph blog data before each build
    eleventyConfig.on('eleventy.before', async () => {
        try {
            compileGraph({
                input: 'src/content/blog',
                output: 'src/assets/data/blog-graph.json'
            });
        } catch (err) {
            console.error('[strata-graph] Error during compile:', err);
        }
    });

    eleventyConfig.watchIgnores.add("src/assets/data/blog-graph.json");
    eleventyConfig.addWatchTarget("src/content/blog/");
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