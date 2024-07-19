import StyleDictionary from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

// sd-transforms, 2nd parameter for options can be added
// See docs: https://github.com/tokens-studio/sd-transforms
registerTransforms(StyleDictionary, {
  expand: {
    composition: false,
    typography: false,
    border: false,
    shadow: false,
  },
  excludeParentKeys: true,
});

import { usesReferences, getReferences } from 'style-dictionary/utils';

//...
function({ dictionary }) {
  return dictionary.allTokens.map(token => {
    let value = JSON.stringify(token.value);
    // the `dictionary` object now has `usesReferences()` and
    // `getReferences()` methods. `usesReferences()` will return true if
    // the value has a reference in it. `getReferences()` will return
    // an array of references to the whole tokens so that you can access their
    // names or any other attributes.
    if (usesReferences(token.original.value)) {
      const refs = getReferences(token.original.value, dictionary);
      refs.forEach(ref => {
        value = value.replace(ref.value, function() {
          return `${ref.name}`;
        });
      });
    }
    return `export const ${token.name} = ${value};`
  }).join(`\n`)
}

const sd = new StyleDictionary({
  source: ['tokens.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    scss: {
      buildPath: 'scss/',
      prefix: 'gf',
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      files: [
        {
          destination: 'variables.scss',
          format: 'scss/variables',
        },
      ],
    },
  },
});
// optionally, cleanup files first..
await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
