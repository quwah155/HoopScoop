import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    return (
        <div style={{
            position: 'relative',
            maxWidth: '500px',
            margin: '0 auto 40px auto'
        }}>
            <Search
                size={20}
                color="var(--text-muted)"
                style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
            />
            <input
                type="text"
                placeholder="Search articles..."
                onChange={(e) => onSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px 12px 12px 45px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '50px',
                    color: '#fff',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.5)';
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 15px rgba(255, 71, 71, 0.15)';
                }}
                onBlur={(e) => {
                    e.target.style.background = 'rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'var(--glass-border)';
                    e.target.style.boxShadow = 'none';
                }}
            />
        </div>
    );
};

export default SearchBar;
