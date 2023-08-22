import { HeaderAndFooterProps } from "./type";

export const headerLinks: HeaderAndFooterProps = {
    links: [
        { link: "/", label: "Home" },
        { link: "/", label: "Databases" },
        { link: "/", label: "Resources" },
        { link: "/", label: "Help" },
    ]
}

export const footerLinks: HeaderAndFooterProps = {
    links: [
        { link: "https://arga.org.au/contact/", label: "Contact us" },
        { link: "https://arga.org.au/about/", label: "About us" },
        { link: "./help", label: "Help" },
        { link: "/acknowledging", label: "Acknowledging ARGA" },
    ]
}