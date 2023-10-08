function Chair({ rotation, size, type }) {
    let source;
    if(type === 'Whole') {
        source = `/backgrounds/sofa.png`;
    }
    else {
        source = `/backgrounds/sofa${type}.png`;
    }
    return (
        <img
            src={source}
            width={size}
            style={{
                transform: `rotate(${rotation}deg)`
            }}
        />
    );
}

export default Chair;