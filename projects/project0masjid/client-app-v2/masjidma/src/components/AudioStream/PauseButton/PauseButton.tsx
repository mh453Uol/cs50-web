const PauseButton = () => {
    return (
        <svg style={{ cursor: 'pointer' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM9.47824 7.25H9.52176C9.73604 7.24999 9.93288 7.24997 10.0982 7.26125C10.2759 7.27338 10.4712 7.30099 10.6697 7.38321C11.0985 7.56083 11.4392 7.90151 11.6168 8.3303C11.699 8.52881 11.7266 8.72415 11.7387 8.90179C11.75 9.06712 11.75 9.26396 11.75 9.47824V14.5218C11.75 14.736 11.75 14.9329 11.7387 15.0982C11.7266 15.2759 11.699 15.4712 11.6168 15.6697C11.4392 16.0985 11.0985 16.4392 10.6697 16.6168C10.4712 16.699 10.2759 16.7266 10.0982 16.7387C9.93288 16.75 9.73604 16.75 9.52176 16.75H9.47824C9.26396 16.75 9.06712 16.75 8.90179 16.7387C8.72415 16.7266 8.52881 16.699 8.3303 16.6168C7.90151 16.4392 7.56083 16.0985 7.38321 15.6697C7.30099 15.4712 7.27338 15.2759 7.26125 15.0982C7.24997 14.9329 7.24999 14.736 7.25 14.5218V9.47824C7.24999 9.26396 7.24997 9.06712 7.26125 8.90179C7.27338 8.72415 7.30099 8.52881 7.38321 8.3303C7.56083 7.9015 7.9015 7.56083 8.3303 7.38321C8.52881 7.30099 8.72415 7.27338 8.90179 7.26125C9.06712 7.24997 9.26396 7.24999 9.47824 7.25ZM8.90131 8.7703C8.84248 8.79558 8.79558 8.84248 8.7703 8.90131C8.76844 8.90866 8.76234 8.93706 8.75778 9.0039C8.75041 9.1119 8.75 9.25677 8.75 9.5V14.5C8.75 14.7432 8.75041 14.8881 8.75778 14.9961C8.76234 15.0629 8.76844 15.0913 8.7703 15.0987C8.79558 15.1575 8.84248 15.2044 8.90131 15.2297C8.90866 15.2316 8.93706 15.2377 9.0039 15.2422C9.1119 15.2496 9.25677 15.25 9.5 15.25C9.74323 15.25 9.8881 15.2496 9.9961 15.2422C10.0629 15.2377 10.0913 15.2316 10.0987 15.2297C10.1575 15.2044 10.2044 15.1575 10.2297 15.0987C10.2316 15.0913 10.2377 15.0629 10.2422 14.9961C10.2496 14.8881 10.25 14.7432 10.25 14.5V9.5C10.25 9.25677 10.2496 9.1119 10.2422 9.0039C10.2377 8.93706 10.2316 8.90866 10.2297 8.90131C10.2044 8.84247 10.1575 8.79558 10.0987 8.7703C10.0913 8.76843 10.0629 8.76233 9.9961 8.75778C9.8881 8.75041 9.74323 8.75 9.5 8.75C9.25677 8.75 9.1119 8.75041 9.0039 8.75778C8.93707 8.76234 8.90866 8.76844 8.90131 8.7703ZM14.4782 7.25H14.5218C14.736 7.24999 14.9329 7.24997 15.0982 7.26125C15.2759 7.27338 15.4712 7.30099 15.6697 7.38321C16.0985 7.56083 16.4392 7.90151 16.6168 8.3303C16.699 8.52881 16.7266 8.72415 16.7387 8.90179C16.75 9.06712 16.75 9.26396 16.75 9.47824V14.5218C16.75 14.736 16.75 14.9329 16.7387 15.0982C16.7266 15.2759 16.699 15.4712 16.6168 15.6697C16.4392 16.0985 16.0985 16.4392 15.6697 16.6168C15.4712 16.699 15.2759 16.7266 15.0982 16.7387C14.9329 16.75 14.736 16.75 14.5218 16.75H14.4782C14.264 16.75 14.0671 16.75 13.9018 16.7387C13.7241 16.7266 13.5288 16.699 13.3303 16.6168C12.9015 16.4392 12.5608 16.0985 12.3832 15.6697C12.301 15.4712 12.2734 15.2759 12.2613 15.0982C12.25 14.9329 12.25 14.736 12.25 14.5218V9.47824C12.25 9.26396 12.25 9.06712 12.2613 8.90179C12.2734 8.72415 12.301 8.52881 12.3832 8.3303C12.5608 7.90151 12.9015 7.56083 13.3303 7.38321C13.5288 7.30099 13.7241 7.27338 13.9018 7.26125C14.0671 7.24997 14.264 7.24999 14.4782 7.25ZM13.9013 8.7703C13.8425 8.79558 13.7956 8.84248 13.7703 8.90131C13.7684 8.90866 13.7623 8.93707 13.7578 9.0039C13.7504 9.1119 13.75 9.25677 13.75 9.5V14.5C13.75 14.7432 13.7504 14.8881 13.7578 14.9961C13.7623 15.0629 13.7684 15.0913 13.7703 15.0987C13.7956 15.1575 13.8425 15.2044 13.9013 15.2297C13.9087 15.2316 13.9371 15.2377 14.0039 15.2422C14.1119 15.2496 14.2568 15.25 14.5 15.25C14.7432 15.25 14.8881 15.2496 14.9961 15.2422C15.0629 15.2377 15.0913 15.2316 15.0987 15.2297C15.1575 15.2044 15.2044 15.1575 15.2297 15.0987C15.2316 15.0913 15.2377 15.0629 15.2422 14.9961C15.2496 14.8881 15.25 14.7432 15.25 14.5V9.5C15.25 9.25677 15.2496 9.1119 15.2422 9.0039C15.2377 8.93707 15.2316 8.90867 15.2297 8.90131C15.2044 8.84248 15.1575 8.79558 15.0987 8.7703C15.0913 8.76844 15.0629 8.76234 14.9961 8.75778C14.8881 8.75041 14.7432 8.75 14.5 8.75C14.2568 8.75 14.1119 8.75041 14.0039 8.75778C13.9371 8.76233 13.9087 8.76844 13.9013 8.7703Z" fill="#1C274C"></path></g>
        </svg>
    )
}
export default PauseButton;