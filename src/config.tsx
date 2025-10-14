import axios from 'axios';


const apiKey = import.meta.env.VITE_COIN_GECKO_API_KEY;

export const pageLimit:number = 10
export const numberLocale :string = 'en-US';
// 'en-US'  => United States        => 1,234,567.89
// 'en-GB'  => United Kingdom       => 1,234,567.89
// 'en-IN'  => India                => 12,34,567.89
// 'de-DE'  => Germany              => 1.234.567,89
// 'fr-FR'  => France               => 1 234 567,89
// 'es-ES'  => Spain                => 1.234.567,89
// 'it-IT'  => Italy                => 1.234.567,89
// 'ja-JP'  => Japan                => 1,234,567.89
// 'zh-CN'  => China                => 1,234,567.89
// 'ar-EG'  => Egypt (Arabic)       => ١٬٢٣٤٬٥٦٧٫٨٩
// 'ru-RU'  => Russia               => 1 234 567,89
// 'ko-KR'  => Korea                => 1,234,567.89
// 'pt-BR'  => Brazil               => 1.234.567,89
// 'nl-NL'  => Netherlands          => 1.234.567,89
// 'sv-SE'  => Sweden               => 1 234 567,89

export const listData = async (url: string, sendParams = true,  header = {}) => {
    try {
        const response = await axios.get(
            url,
            {
                params: sendParams ? {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 250,
                    page: 1,
                    sparkline: false,
                }: {} ,
                headers: {
                    'Accept': 'application/json',
                    'x-cg-demo-api-key': apiKey,
                    ...header
                }
            },
        );
        console.log(response.data);
        return response
    } catch (error) {
        console.error('Error fetching coins:', error);
        return error
    }
}

/**
* set LocalStorage
* @param {String} key 
* @param {Any} value 
*/
export const setLocalData = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

/**
 * get LocalStorage
 * @param {String} key 
 * @returns 
 */
export const getLocalData = (key: string) => {
    const value = localStorage.getItem(key)
    // Check for key existence but undefined value
    if (localStorage.hasOwnProperty(key) && value === undefined) {
        localStorage.removeItem(key)
        return null
    }
    // Return raw value if undefined or null, avoid JSON.parse on undefined
    if (value === null || value === undefined) {
        return null
    }
    try {
        return JSON.parse(value)
    } catch (e) {
        console.error(`Failed to parse localStorage key "${key}":`, e)
        return value // Return raw string as fallback
    }
}

/**
 * clear LocalStorage Use in Logout method
 * @param {String} key 
 */
export const clearLocalData = (key: string) => {
    localStorage.removeItem(key)
}


//example --> '  123.456  ' --> 122.456
//it will handle all case of undefined and null 
/**
 * 
 * @param {Number} value //any number value 
 * @returns 
 */
export const safeParseFloat = (value: number | string) => {

    const num = parseFloat(value)
    return value == null || value === '' || isNaN(num) || !isFinite(num) ? 0 : num
}


//example --> '123' --> 123 , undefined -> 0
//it will handle all case of undefined and null 
/**
 * 
 * @param {Number} value //any number value 
 * @returns 
 */
export const safeParseInt = (value: number | string) => {
    const num = parseInt(value)
    return value == null || value === '' || isNaN(num) || !isFinite(num) ? 0 : num
}


//ex --> 123.4563 --> 123.45 , cut = 3 than 123.456
/**
 * 
 * @param {Number} value //any number value 
 * @param {Number} cut //number of point value you need after dot
 * @returns 
 */
/**
* Rounds a number to a specified number of decimal places without returning NaN or undefined.
* @param {Number} value // any numeric value
* @param {Number} cut   // number of decimal places needed after the dot
* @returns {Number}     // parsed float with specified decimal places
*/
export const toFixedFloat = (value: string | number, cut: number = 8) => {
    try {
        // Safely parse the input value to a number using safeParseFloat to handle undefined, null, and empty strings
        let numValue = safeParseFloat(value)

        // Check if the parsed number is still valid and finite (not NaN or Infinity)
        if (Number.isFinite(numValue)) {
            // Use toFixed for setting the decimal places and parse it back to a float
            return safeParseFloat(numValue.toFixed(cut))
        } else {
            // Return 0 as fallback if the value is not finite (like NaN, Infinity)
            return 0
        }
    } catch (err) {
        console.log('Error in toFixedFloat:', value, err)
        // Return 0 in case of an unexpected error
        return 0
    }
}

// const url = 'https://api.coingecko.com/api/v3/coins/markets';
// const options = {method: 'GET', headers: {}, body: undefined};

// try {
//   const response = await fetch(url, options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }

