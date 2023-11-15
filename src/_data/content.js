const fs = require('fs');
const marked = require('marked');
const mdRenderer = new marked.Renderer();
mdRenderer.link = function (_href, _title, _text) {
  const link = marked.Renderer.prototype.link.apply(this, arguments);
  return link.replace('<a', "<a target='_blank'");
};

const header = 'Omnitool Newsfeed';
const footer = '(c) 2023 MERCENARIES.AI PTE. LTD. All rights reserved.';

//load entries.js from yaml using js-yaml
const yaml = require('js-yaml');
let entries = yaml.load(fs.readFileSync('../../updates.yaml', 'utf8')).reverse();

// use marked to render markdown
entries = entries.map((entry) => {
  entry.html = marked.parse(entry.body, {renderer: mdRenderer});
  return entry;
})


// Page details
const pageTitle = 'Omnitool Newsfeed'; // The title of the page that shows in the browser tab
const pageDescription = 'Omnitool news, changes and updates.'; // The description of the page for search engines
const pageAuthor = 'Omnitool.ai Team'; // Your name

// DON'T EDIT BELOW THIS LINE! --------------------------------------------------------------------
const getFilters = (entries) => {
  const filters = new Set();
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    if (Object.prototype.hasOwnProperty.call(entry, 'categories')) {
      for (var j = 0; j < entry.categories.length; j++) {
        filters.add(entry.categories[j]);
      }
    }
  }
  var filtersArray = [...filters];
  filtersArray.sort()
  return filtersArray;
};

const addCategoriesStringsToEntries = (entries) => {
  for (const entry of entries) {
    if (Object.prototype.hasOwnProperty.call(entry, 'categories')) {
      entry.categoriesString = entry.categories.join(',');
    }
  }
  return entries;
};

module.exports = {
  /*header,*/
  footer,
  entries: addCategoriesStringsToEntries(entries),
  filters: getFilters(entries),
  head: {
    title: pageTitle,
    description: pageDescription,
    author: pageAuthor,
  },
};
