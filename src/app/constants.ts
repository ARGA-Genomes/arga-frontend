import { HeaderAndFooterProps } from "./type";

export const MAX_WIDTH = {xs: "100%", sm: "100%", md: "100%", lg: "95%", xl: "95%" };

export const headerLinks: HeaderAndFooterProps = {
    links: [
        { link: "/", label: "APP HOME" },
        { link: "/datasets", label: "DATA SOURCES" },
        { link: "https://arga.org.au/", label: "PROJECT HOME" },
    ]
}

export const footerLinks: HeaderAndFooterProps = {
    links: [
        { link: "https://arga.org.au/contact/", label: "Contact us" },
        { link: "https://arga.org.au/about/", label: "About us" },
        // { link: "./help", label: "Help" },
        { link: "/acknowledging", label: "Acknowledging ARGA" },
    ]
}
