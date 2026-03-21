import type { GithubUser } from "../types"


type PropType = {
    suggestions: GithubUser[];
    onSelect:(user:string)=>void;
}

function SuggestUsers({ suggestions,onSelect }: PropType) {


    return (
        <ul className="suggestions">
            {suggestions.map((user: GithubUser) =>
            (
                <li key={user.login} onClick={()=>onSelect(user.login)}>
                    <img src={user.avatar_url} alt={user.name} className="avatar-xs" />
                    {user.login}
                </li>
            )
            ).slice(0, 5)}
        </ul>
    )
}

export default SuggestUsers
