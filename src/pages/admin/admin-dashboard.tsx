import { useEffect, useState } from 'react';
import { getCookie } from '../../utils/cookie';
import { API_URL } from '../../config/default';
import { useNavigate } from 'react-router-dom';
import { verifyToken, logout } from '../../services/jwt';
import { Conversation } from '../../data/conversation';
import { Admin } from '../../data/admin';
import { updateSessionAdmin, getSessions } from '../../services/sessions';
import { getAdmins } from '../../services/admin';
import axios from 'axios';
import ChatBox from '../../components/chat-box';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = getCookie('token');
  const [adminMessage, setAdminMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken(token);
      if (!isValid) {
        navigate('/admin/login');
      } else {
        const fetchAdminMessage = async () => {
          try {
            const response = await axios.get(`${API_URL}/api/admin`, {
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
              },
            });

            if (response.status === 200 && token) {
              const sessions = await getSessions(token);
              const { message } = response.data;
              setConversations(sessions);
              setAdminMessage(message);
              setSessionId(sessions[0]?.id);
            } else {
              alert('Server Error!');
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred while fetching admin message.');
          }
        };

        fetchAdminMessage();

        const fetchAdmins = async () => {
          try {
            const response = await getAdmins(token);
            setAdmins(response);
            setSelectedAdminId(response[0]?.adminid);
          } catch (error) {
            console.error(error);
            alert('An error occurred while fetching admins.');
          }
        };

        fetchAdmins();
      }
    };
    checkToken();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminChat = () => {
    navigate('/admin/chat');
  };

  const handleConversationClick = (sessionId: string) => {
    setSessionId(sessionId);
  };

  const handleAdminChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdminId(event.target.value);
  };

  const handleUpdateClick = async () => {
    try {
      await updateSessionAdmin(sessionId, selectedAdminId, token);
      alert('Admin updated successfully.');
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating admin.');
    }
  };

  return (
    <div style={{ margin: 'auto' }}>
      <h1>Admin Dashboard</h1>
      <p>{adminMessage}</p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <button className="admin-home-button" onClick={handleAdminChat}>
          Admin Chat
        </button>
      </div>
      <div style={{ margin: '15px' }}>
        <label htmlFor="admin-dropdown">Assign admin: </label>
        <select
          id="admin-dropdown"
          value={selectedAdminId}
          onChange={handleAdminChange}
        >
          {admins.map((admin) => (
            <option key={admin.adminid} value={admin.adminid}>
              {admin.username}
            </option>
          ))}
        </select>
        <button onClick={handleUpdateClick}>Update</button>
      </div>
      <div className="admin-dashboard">
        <div className="admin-panel">
          <h2 style={{ margin: '15px' }}>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={sessionId === conversation.id ? 'selected' : ''}
              >
                {conversation.id}
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-content">
          {sessionId ? (
            <ChatBox sessionId={sessionId} token={token} role="admin" />
          ) : (
            <p>No active conversations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
