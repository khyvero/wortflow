{/*for considering which article by gender */}
export const getArticle = (gender?: string | null) => {
    if (gender === 'masculine') return 'der';
    if (gender === 'feminine') return 'die';
    if (gender === 'neuter') return 'das';
    return '';
};

{/*for considering which text color by gender */}
export const getGenderColor = (gender?: string | null) => {
    if (gender === 'masculine') return 'var(--badge-der-text)';
    if (gender === 'feminine') return 'var(--badge-die-text)';
    if (gender === 'neuter') return 'var(--badge-das-text)';
    return 'var(--text-dark)';
};

{/*for considering which background color by gender */}
export const getPanelColor = (gender?: string | null) => {
    if (gender === 'masculine') return 'var(--badge-der-bg)';
    if (gender === 'feminine') return 'var(--badge-die-bg)';
    if (gender === 'neuter') return 'var(--badge-das-bg)';
    return 'var(--card-bg, #ffffff)';
};

{/*pronunciation */}
export const playAudio = (text: string) => {
    // Check if the browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
        alert("Sorry, your browser doesn't support text-to-speech!");
        return;
    }

    // cancel any currently playing audio so they don't overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // Set language to German
    utterance.rate = 0.9;     // Slightly slower for clearer pronunciation

    // fetch all available voices in the browser
    const voices = window.speechSynthesis.getVoices();

    //Find the first voice that is German (e.g., 'de-DE', 'de-AT')
    const germanVoice = voices.find(voice => voice.lang.startsWith('de'));

    if (germanVoice) {
        utterance.voice = germanVoice; // Force the browser to use the German voice
    }

    //speak
    window.speechSynthesis.speak(utterance);
    //speak
    // window.speechSynthesis.speak(utterance);
    //speak
    // window.speechSynthesis.speak(utterance);
}
