import { FaClock, FaUser } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import fetchGithubUser from "../api/github";

type RecentSearchesProps={
    users:string[];
    onSelect: (u:string)=>void;
}

function RecentSearches({users, onSelect}:RecentSearchesProps) {
    const queryClient = useQueryClient();

    return (
        <div className="recent-searches">
            <div className="recent-header">
                <FaClock />
                <h3>Recent Searches</h3>
            </div>
            <ul>
                {users.map((u:string) => (
                    <li key={u}>
                        <button onClick={()=>{
                            onSelect(u);
                        }}
                        onMouseEnter={()=>{
                            queryClient.prefetchQuery({
                                queryKey: ["users", u],
                                queryFn: ()=> fetchGithubUser(u)
                            });
                        }}
                        >
                            <FaUser className="user-icon" />
                            {u}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RecentSearches
