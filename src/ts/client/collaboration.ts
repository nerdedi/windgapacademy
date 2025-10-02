import { writable } from 'svelte/store';

export interface SharedBoard {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  collaborators: Array<{
    userId: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor' | 'admin';
    joinedAt: number;
  }>;
  isPublic: boolean;
  shareCode: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  boardData: {
    pages: any[];
    tiles: any[];
    settings: any;
  };
}

export interface CollaborationEvent {
  id: string;
  boardId: string;
  userId: string;
  userName: string;
  type: 'tile_added' | 'tile_updated' | 'tile_deleted' | 'page_added' | 'page_updated' | 'page_deleted' | 'user_joined' | 'user_left';
  timestamp: number;
  data: any;
}

class CollaborationManager {
  private apiUrl: string;
  private ws: WebSocket | null = null;
  private userId: string = '';
  private userName: string = '';
  private currentBoardId: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async initializeCollaboration(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;

    // Initialize WebSocket connection for real-time collaboration
    await this.connectWebSocket();
  }

  private async connectWebSocket() {
    const wsUrl = this.apiUrl.replace('http', 'ws') + '/collaboration/ws';

    try {
      this.ws = new WebSocket(`${wsUrl}?userId=${this.userId}&userName=${encodeURIComponent(this.userName)}`);

      this.ws.onopen = () => {
        console.log('Collaboration WebSocket connected');
        this.reconnectAttempts = 0;
        collaborationStore.update(state => ({ ...state, isConnected: true }));
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      };

      this.ws.onclose = () => {
        console.log('Collaboration WebSocket disconnected');
        collaborationStore.update(state => ({ ...state, isConnected: false }));
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connectWebSocket();
      }, delay);
    }
  }

  private handleWebSocketMessage(message: any) {
    switch (message.type) {
      case 'board_update':
        this.handleBoardUpdate(message.data);
        break;
      case 'user_joined':
        this.handleUserJoined(message.data);
        break;
      case 'user_left':
        this.handleUserLeft(message.data);
        break;
      case 'collaboration_event':
        this.handleCollaborationEvent(message.data);
        break;
    }
  }

  private handleBoardUpdate(data: any) {
    collaborationStore.update(state => ({
      ...state,
      currentBoard: { ...state.currentBoard, ...data }
    }));
  }

  private handleUserJoined(data: any) {
    collaborationStore.update(state => {
      const activeUsers = [...state.activeUsers];
      if (!activeUsers.find(u => u.userId === data.userId)) {
        activeUsers.push(data);
      }
      return { ...state, activeUsers };
    });
  }

  private handleUserLeft(data: any) {
    collaborationStore.update(state => ({
      ...state,
      activeUsers: state.activeUsers.filter(u => u.userId !== data.userId)
    }));
  }

  private handleCollaborationEvent(event: CollaborationEvent) {
    collaborationStore.update(state => ({
      ...state,
      recentEvents: [event, ...state.recentEvents.slice(0, 49)] // Keep last 50 events
    }));
  }

  async createSharedBoard(boardData: any, isPublic: boolean = false): Promise<SharedBoard> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: boardData.name,
        description: boardData.description || '',
        isPublic,
        boardData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create shared board: ${response.statusText}`);
    }

    return await response.json();
  }

  async joinSharedBoard(shareCode: string): Promise<SharedBoard> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/join/${shareCode}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to join shared board: ${response.statusText}`);
    }

    const board = await response.json();
    this.setCurrentBoard(board.id);
    return board;
  }

  async getSharedBoards(): Promise<SharedBoard[]> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get shared boards: ${response.statusText}`);
    }

    return await response.json();
  }

  async inviteCollaborator(boardId: string, email: string, role: 'viewer' | 'editor' = 'editor'): Promise<void> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/${boardId}/invite`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, role })
    });

    if (!response.ok) {
      throw new Error(`Failed to invite collaborator: ${response.statusText}`);
    }
  }

  async updateCollaboratorRole(boardId: string, userId: string, role: 'viewer' | 'editor' | 'admin'): Promise<void> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/${boardId}/collaborators/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      throw new Error(`Failed to update collaborator role: ${response.statusText}`);
    }
  }

  async removeCollaborator(boardId: string, userId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/${boardId}/collaborators/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to remove collaborator: ${response.statusText}`);
    }
  }

  setCurrentBoard(boardId: string) {
    this.currentBoardId = boardId;

    // Join the board's WebSocket room
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'join_board',
        boardId
      }));
    }
  }

  async broadcastChange(changeType: string, changeData: any) {
    if (!this.currentBoardId) return;

    // Send change via WebSocket for real-time updates
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'board_change',
        boardId: this.currentBoardId,
        changeType,
        changeData,
        userId: this.userId,
        userName: this.userName
      }));
    }

    // Also save to backend API
    try {
      await fetch(`${this.apiUrl}/collaboration/boards/${this.currentBoardId}/changes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: changeType,
          data: changeData,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to save change to backend:', error);
    }
  }

  async generateShareCode(boardId: string): Promise<string> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/${boardId}/share-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to generate share code: ${response.statusText}`);
    }

    const data = await response.json();
    return data.shareCode;
  }

  async exportSharedBoard(boardId: string): Promise<string> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/${boardId}/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to export board: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.stringify(data, null, 2);
  }

  async getCollaborationHistory(boardId: string, limit: number = 100): Promise<CollaborationEvent[]> {
    const response = await fetch(`${this.apiUrl}/collaboration/boards/${boardId}/history?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get collaboration history: ${response.statusText}`);
    }

    return await response.json();
  }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Collaboration store
interface CollaborationState {
  isConnected: boolean;
  currentBoard: SharedBoard | null;
  activeUsers: Array<{ userId: string; userName: string; joinedAt: number }>;
  recentEvents: CollaborationEvent[];
  sharedBoards: SharedBoard[];
}

const initialState: CollaborationState = {
  isConnected: false,
  currentBoard: null,
  activeUsers: [],
  recentEvents: [],
  sharedBoards: []
};

export const collaborationStore = writable<CollaborationState>(initialState);

// Create singleton instance
export const collaborationManager = new CollaborationManager(
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8172'
    : 'https://api.freespeechaac.com'
);
