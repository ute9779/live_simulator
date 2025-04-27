// カタカナ→ひらがな
export const useKatakanaToHiragana = (text: string) => {
    return text.replace(/[\u30A1-\u30F6]/g, function(match) {
        const charCode = match.charCodeAt(0) - 0x60
        return String.fromCharCode(charCode)
    })
}