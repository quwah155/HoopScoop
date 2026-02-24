const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'APPROVED':
                return {
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                };
            case 'PENDING':
                return {
                    background: 'rgba(234, 179, 8, 0.1)',
                    color: '#eab308',
                    border: '1px solid rgba(234, 179, 8, 0.2)'
                };
            case 'REJECTED':
                return {
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                };
            case 'DRAFT':
                return {
                    background: 'rgba(156, 163, 175, 0.1)',
                    color: '#9ca3af',
                    border: '1px solid rgba(156, 163, 175, 0.2)'
                };
            default:
                return {
                    background: 'rgba(156, 163, 175, 0.1)',
                    color: '#9ca3af',
                    border: '1px solid rgba(156, 163, 175, 0.2)'
                };
        }
    };

    return (
        <span style={{
            ...getStatusStyles(),
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block'
        }}>
            {status}
        </span>
    );
};

export default StatusBadge;
