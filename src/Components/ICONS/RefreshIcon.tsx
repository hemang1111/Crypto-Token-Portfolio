

function RefreshIcon(props : any) {
  return (
     <span
      className={`material-symbols-outlined text-lg  ${
        props.rotating ? 'animate-spin' : ''
      } ${props.class}`}
    >
      autorenew
    </span>
  )
}

export default RefreshIcon