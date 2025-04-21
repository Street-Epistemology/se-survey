/**
 *
 * from
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt#getting_whole_characters
 *
 */

export default function getCharAt(str: string, i: number): string | boolean {
  const code = str.charCodeAt(i);

  if (Number.isNaN(code)) {
    return ''; // Position not found
  }
  if (code < 0xd800 || code > 0xdfff) {
    return str.charAt(i);
  }

  // High surrogate (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xd800 <= code && code <= 0xdbff) {
    if (str.length <= i + 1) {
      throw Error('High surrogate without following low surrogate');
    }
    const next = str.charCodeAt(i + 1);
    if (0xdc00 > next || next > 0xdfff) {
      throw Error('High surrogate without following low surrogate');
    }
    return str.charAt(i) + str.charAt(i + 1);
  }
  // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
  if (i === 0) {
    throw Error('Low surrogate without preceding high surrogate');
  }
  const prev = str.charCodeAt(i - 1);

  // (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xd800 > prev || prev > 0xdbff) {
    throw Error('Low surrogate without preceding high surrogate');
  }
  // We can pass over low surrogates now as the second component
  // in a pair which we have already processed
  return false;
}

const str = 'A \uD87E\uDC04 Z'; // We could also use a non-BMP character directly
for (let i = 0, chr; i < str.length; i += 1) {
  chr = getCharAt(str, i);
  if (chr === false) {
    continue;
  }
  // Adapt this line at the top of each loop, passing in the whole string and
  // the current iteration and returning a variable to represent the
  // individual character

  console.log(chr);
}
