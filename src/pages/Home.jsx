import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Hero from '../context/components/Hero';
import BlogCard from '../context/components/BlogCard';
import SkeletonCard from '../context/components/SkeletonCard';
import SearchBar from '../context/components/SearchBar';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setPosts(data);
                } else {
                    console.error('Failed to fetch posts:', data);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchPosts();
        else setLoading(false);
    }, [token]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Hero />
            <div id="latest" className="container" style={{ paddingBottom: '100px' }}>
                <SearchBar onSearch={setSearchTerm} />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '40px'
                }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0 }}>
                        Trending <span className="text-gradient">Now</span>
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
                    gap: 'clamp(16px, 4vw, 40px)'
                }}>
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <BlogCard post={post} />
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                            <h3>No posts found matching "{searchTerm}"</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
