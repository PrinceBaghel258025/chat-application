// 1. Import `extendTheme`
import { extendTheme, type ThemeConfig } from "@chakra-ui/react"


const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false
}
// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme(config,
    {
        styles: {
            global: {
                body: {
                    bg: 'blackAlpha.800',
                    color: 'white'
                }
            }
        },
        colors: {
            brand: {
                100: "#1b7ced",
                900: "#1a202c",
            },
        }
    })

export default theme;