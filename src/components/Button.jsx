function Button({action,className}){
    return <button class={className==="start"?"button is-success":"button is-danger"} className={className}>{action}</button>
}

export default Button;