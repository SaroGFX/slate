const path = require('path');
const fs = require('fs');
const Liquid = require('liquidjs');

const engine = new Liquid();

module.exports = async function layoutLoader(content) {
  const done = this.async();
  const template = engine.parse(content);

  let html = '';

  for (const tpl of templates) {
    try {
      html += await renderTemplate.call(this, tpl);
    } catch (error) {
      if (error instanceof RenderBreakError) {
        error.resolvedHTML = html;
        throw error;
      }
      throw new RenderError(error, tpl);
    }
  }

  return html;

  async function renderTemplate(template) {
    if (template.type === 'tag') {
      const partial = await this.renderTag(template, scope);
      return partial === undefined ? '' : partial;
    }
    if (template.type === 'value') {
      return this.renderValue(template, scope);
    }
    return template.value;
  }
};
