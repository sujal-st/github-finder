import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import fetchGithubUser from "../api/github";
import RecentSearches from "./RecentSearches";
import UserCard from "./UserCard";
import { useDebounce } from "use-debounce";
import { fetchSuggestedUsers } from "../api/github";
import SuggestUsers from "./SuggestUsers";

function UserSearch() {
    const [username, setUsername] = useState("");
    const [submittedUsername, setSubmittedUsername] = useState("");
    const [recentUsers, setRecentUsers] = useState<string[]>(() => {
        const stored = localStorage.getItem("recentUsers");
        return stored ? JSON.parse(stored) : []
    });

    const [debouncedUsername] = useDebounce(username, 300);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // fetch specific user
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['users', submittedUsername],
        queryFn: () => fetchGithubUser(submittedUsername),
        enabled: !!submittedUsername, // !! turns the submitedUsername into boolean and if empty string then it will be false else true
    });

    // fetch suggestions of users
    const { data: suggestions } = useQuery({
        queryKey: ['github-user-suggestions', debouncedUsername],
        queryFn: () => fetchSuggestedUsers(debouncedUsername),
        enabled: debouncedUsername.length > 1,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = username.trim();
        if (!trimmed) return;
        setSubmittedUsername(trimmed);
        setUsername("");

        setRecentUsers((prev) => {
            const updated = [trimmed, ...prev.filter((p) => p != trimmed)]
            return updated.slice(0, 5);
        })
    }

    useEffect(() => {
        const searchHistory = JSON.stringify(recentUsers)
        localStorage.setItem("recentUsers", searchHistory);
    }, [recentUsers])



    return (
        <>
            <form onSubmit={handleSubmit} className="form">
                <div className="dropdown-wrapper">
                    <input type="text" placeholder="Enter GitHub username..." value={username} onChange={(e) => {
                        const val = e.target.value;
                        setUsername(val);
                        setShowSuggestions(val.trim().length > 0)
                    }} />

                    {showSuggestions && suggestions?.length > 0 && (
                        <SuggestUsers suggestions={suggestions} onSelect={(selected) => {
                            setUsername(selected);
                            setShowSuggestions(false);

                            submittedUsername != selected ? setSubmittedUsername(selected) : refetch();

                            setRecentUsers((prev) => {
                                const updated = [selected, ...prev.filter((p) => p != selected)]
                                return updated.slice(0, 5);
                            })

                        }} />
                    )}
                </div>
                <button type="submit">Search</button>
            </form>

            {isLoading && <p className="status">
                Loading...</p>}
            {isError && <p className="status error">
                {error.message}</p>}

            {data && <UserCard user={data} />}

            {recentUsers.length > 0 && (
                <RecentSearches users={recentUsers} onSelect={(username) => {
                    setUsername(username);
                    setSubmittedUsername(username);
                }} />
            )}
        </>
    )
}

export default UserSearch
