function Chair({ rotation, size, type , className}) {
    let source;
    if(type === 'Whole') {
        source = `/backgrounds/sofa.png`;
    }
    else {
        source = `/backgrounds/sofa${type}.png`;
    }
    return (
        <div className={...className}>
            <h2>Jugador 1</h2>
            <img
                src={source}
                width={size}
                style={{
                    transform: `rotate(${rotation}deg)`
                }}
            />
        </div>
    );
}

export default Chair;