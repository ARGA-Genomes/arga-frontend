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
        { link: "./contact_us", label: "Contact us" },
        { link: "./about", label: "About us" },
        { link: "./help", label: "Help" },
        { link: "/acknowledging", label: "Acknowledging ARGA" },
    ]
}