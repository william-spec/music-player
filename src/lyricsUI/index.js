import lyrics from './lyrics'

const install = (app) => {
    app.component(lyrics.name, lyrics)
}

export default install