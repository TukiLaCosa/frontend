function Deck({ src }) {
    return (
        <img
            id='deck'
            src={src}
            width={180}
            alt=''
            onClick={(e) => { selectCard(e) }}
        />
    );
}

export default Deck;