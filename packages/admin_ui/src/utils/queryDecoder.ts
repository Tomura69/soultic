const queryDecoder = (
  parseNumbers = true,
  parseBool = true,
  ignoreNull = false,
  ignoreEmptyString = true
) => {
  return function decoder(str: string, _: unknown, charset?: string) {
    const strWithoutPlus = str.replace(/\+/g, ' ')
    if (charset === 'iso-8859-1') {
      // unescape never throws, no try...catch needed:
      return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape)
    }

    if (parseNumbers && /^(\d+|\d*\.\d+)$/.test(str)) {
      return parseFloat(str)
    }

    const keywords: { [key: string]: undefined | null } = {
      null: ignoreNull ? undefined : null,
      undefined,
    }

    if (str in keywords) {
      return keywords[str]
    }

    const boolKeywords: { [key: string]: boolean } = {
      true: true,
      false: false,
    }

    if (parseBool && str in boolKeywords) {
      return boolKeywords[str]
    }

    if (ignoreEmptyString && str.length === 0) {
      // eslint-disable-next-line
      return
    }

    try {
      return decodeURIComponent(strWithoutPlus)
    } catch (e) {
      return strWithoutPlus
    }
  }
}

export default queryDecoder
