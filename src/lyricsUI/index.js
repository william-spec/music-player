import lyrics from '../components/lyrics'

const install = (app) => {
    app.component(lyrics.name, lyrics)
}

export default install