function Chair({ rotation, size, type , className, player = 'Tuki'}) {
    let source;
    if(type === 'Whole') {
        source = `/backgrounds/sofa.png`;
    }
    else {
        source = `/backgrounds/sofa${type}.png`;
    }
    return (
        <div className={className}>
            <h2><button 
                    className="button is-success is-light is-outlined"
                    style={{margin: '10px', padding: '10px'}}
                >{player.name}</button></h2>
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