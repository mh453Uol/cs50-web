export interface Announcement {
    message: string,
    from: string,
    to: string,
    link?: {
        url: string,
        name: string
    }
}