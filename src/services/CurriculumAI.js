/**
 * CurriculumAI.js - AI-powered curriculum generation service
 * 
 * Features:
 * - Dynamic curriculum generation based on learner's needs and goals
 * - Smart sequencing of learning materials
 * - Personalized difficulty adjustment
 * - Skill gap analysis
 * - Content recommendation engine
 * - Learning path visualization
 * - Progress tracking with ML-based insights
 * - Adaptive assessment generation
 * - Topic clustering and knowledge mapping
 * - Multi-modal learning support
 */

import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import OpenAI if using their API
// import OpenAI from 'openai';

// Models for curriculum AI
class LearningModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.skillTaxonomy = data.skillTaxonomy || [];
    this.difficultyLevels = data.difficultyLevels || ['beginner', 'intermediate', 'advanced', 'expert'];
    this.learningStyles = data.learningStyles || ['visual', 'auditory', 'reading/writing', 'kinesthetic'];
    this.contentTypes = data.contentTypes || ['video', 'interactive', 'text', 'quiz', 'project'];
    this.prerequisites = data.prerequisites || [];
    this.outcomes = data.outcomes || [];
  }
}

class LearnerProfile {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.skillLevels = data.skillLevels || {};
    this.interests = data.interests || [];
    this.goals = data.goals || [];
    this.learningHistory = data.learningHistory || [];
    this.strengths = data.strengths || [];
    this.weaknesses = data.weaknesses || [];
    this.preferredLearningStyles = data.preferredLearningStyles || [];
    this.preferredContentTypes = data.preferredContentTypes || [];
    this.availableTime = data.availableTime || { daily: 60, weekly: 300 }; // in minutes
    this.completedModules = data.completedModules || [];
    this.assessmentResults = data.assessmentResults || [];
    this.feedbackHistory = data.feedbackHistory || [];
  }

  // Calculate skill proficiency
  getSkillProficiency(skillId) {
    return this.skillLevels[skillId] || 0;
  }

  // Update skill after learning
  updateSkill(skillId, proficiencyDelta) {
    this.skillLevels[skillId] = (this.skillLevels[skillId] || 0) + proficiencyDelta;
    return this.skillLevels[skillId];
  }
}

class CurriculumNode {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.skills = data.skills || [];
    this.prerequisites = data.prerequisites || [];
    this.content = data.content || [];
    this.estimatedDuration = data.estimatedDuration || 0; // in minutes
    this.difficulty = data.difficulty || 'beginner';
    this.learningStyles = data.learningStyles || [];
    this.assessments = data.assessments || [];
    this.type = data.type || 'lesson'; // lesson, exercise, project, assessment
    this.metadata = data.metadata || {};
  }
}

class LearningPath {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.goals = data.goals || [];
    this.nodes = data.nodes || [];
    this.edges = data.edges || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.status = data.status || 'active';
    this.estimatedCompletion = data.estimatedCompletion || null;
    this.progress = data.progress || 0;
    this.currentNode = data.currentNode || null;
  }

  // Get next recommended node
  getNextNode() {
    if (!this.currentNode) {
      // Find root nodes (nodes with no incoming edges)
      const rootNodes = this.nodes.filter(node => 
        !this.edges.some(edge => edge.target === node.id)
      );
      return rootNodes.length > 0 ? rootNodes[0] : null;
    }

    // Find nodes connected to current node
    const outgoingEdges = this.edges.filter(edge => edge.source === this.currentNode.id);
    const nextNodeIds = outgoingEdges.map(edge => edge.target);
    return this.nodes.find(node => nextNodeIds.includes(node.id)) || null;
  }

  // Calculate progress percentage
  calculateProgress() {
    if (this.nodes.length === 0) return 0;
    
    const completedNodes = this.nodes.filter(node => node.metadata.completed);
    this.progress = (completedNodes.length / this.nodes.length) * 100;
    return this.progress;
  }
}

// Main Curriculum AI Service
class CurriculumAI {
  constructor(config = {}) {
    this.db = getFirestore();
    this.auth = getAuth();
    
    // Settings
    this.config = {
      defaultModel: 'gpt-4',
      useOpenAI: config.useOpenAI !== false,
      adaptiveDifficulty: config.adaptiveDifficulty !== false,
      personalizationWeight: config.personalizationWeight || 0.7,
      skillGapWeight: config.skillGapWeight || 0.8,
      interestWeight: config.interestWeight || 0.6,
      learningSizeLimit: config.learningSizeLimit || 5, // max nodes recommended at once
      ...config
    };
    
    // Initialize OpenAI if using it
    if (this.config.useOpenAI && this.config.openAIKey) {
      // this.openai = new OpenAI({ apiKey: this.config.openAIKey });
    }
    
    // Cache for performance
    this.cache = {
      learnerProfiles: new Map(),
      learningModels: new Map(),
      curriculumNodes: new Map(),
      learningPaths: new Map()
    };
    
    // Analytics tracker
    this.analytics = {
      recommendationCount: 0,
      personalizationScore: 0,
      learnerSatisfaction: new Map(),
      pathCompletionRate: 0,
      skillImprovementRate: new Map()
    };
    
    // ML model references (would be loaded in production)
    this.models = {
      skillPredictor: null,
      contentRecommender: null,
      difficultyEstimator: null,
      knowledgeMapper: null
    };
    
    this.skillTaxonomy = null;
    this.loadSkillTaxonomy();
  }

  // Load the skill taxonomy from Firestore
  async loadSkillTaxonomy() {
    try {
      const skillDoc = await getDoc(doc(this.db, 'curriculum', 'skillTaxonomy'));
      if (skillDoc.exists()) {
        this.skillTaxonomy = skillDoc.data();
        console.log('Skill taxonomy loaded successfully');
      } else {
        console.warn('Skill taxonomy not found');
      }
    } catch (error) {
      console.error('Failed to load skill taxonomy:', error);
    }
  }

  // Initialize the learning system for a user
  async initializeForUser(userId) {
    // Get or create learner profile
    let learnerProfile = await this.getLearnerProfile(userId);
    
    if (!learnerProfile) {
      learnerProfile = new LearnerProfile({ userId });
      await this.saveLearnerProfile(learnerProfile);
    }
    
    // Initialize an empty learning path if none exists
    const paths = await this.getLearningPaths(userId);
    
    if (paths.length === 0) {
      const defaultPath = new LearningPath({
        userId,
        title: 'Getting Started',
        description: 'Your personalized learning journey',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await this.saveLearningPath(defaultPath);
    }
    
    return {
      profile: learnerProfile,
      paths: await this.getLearningPaths(userId)
    };
  }

  // Get learner profile from Firestore
  async getLearnerProfile(userId) {
    // Check cache first
    if (this.cache.learnerProfiles.has(userId)) {
      return this.cache.learnerProfiles.get(userId);
    }
    
    try {
      const profileDoc = await getDoc(doc(this.db, 'learnerProfiles', userId));
      
      if (profileDoc.exists()) {
        const profile = new LearnerProfile({
          id: profileDoc.id,
          ...profileDoc.data()
        });
        
        // Cache the profile
        this.cache.learnerProfiles.set(userId, profile);
        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching learner profile:', error);
      return null;
    }
  }

  // Save learner profile to Firestore
  async saveLearnerProfile(profile) {
    try {
      await setDoc(doc(this.db, 'learnerProfiles', profile.userId), {
        userId: profile.userId,
        skillLevels: profile.skillLevels,
        interests: profile.interests,
        goals: profile.goals,
        learningHistory: profile.learningHistory,
        strengths: profile.strengths,
        weaknesses: profile.weaknesses,
        preferredLearningStyles: profile.preferredLearningStyles,
        preferredContentTypes: profile.preferredContentTypes,
        availableTime: profile.availableTime,
        completedModules: profile.completedModules,
        assessmentResults: profile.assessmentResults,
        feedbackHistory: profile.feedbackHistory,
        updatedAt: new Date()
      });
      
      // Update cache
      this.cache.learnerProfiles.set(profile.userId, profile);
      return true;
    } catch (error) {
      console.error('Error saving learner profile:', error);
      return false;
    }
  }

  // Get learning paths for a user
  async getLearningPaths(userId) {
    try {
      const pathsQuery = query(
        collection(this.db, 'learningPaths'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(pathsQuery);
      const paths = [];
      
      querySnapshot.forEach(doc => {
        const data = doc.data();
        paths.push(new LearningPath({
          id: doc.id,
          ...data
        }));
      });
      
      // Update cache
      paths.forEach(path => {
        this.cache.learningPaths.set(path.id, path);
      });
      
      return paths;
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
  }

  // Save learning path to Firestore
  async saveLearningPath(path) {
    try {
      const pathData = {
        userId: path.userId,
        title: path.title,
        description: path.description,
        goals: path.goals,
        nodes: path.nodes,
        edges: path.edges,
        createdAt: path.createdAt,
        updatedAt: new Date(),
        status: path.status,
        estimatedCompletion: path.estimatedCompletion,
        progress: path.progress,
        currentNode: path.currentNode ? path.currentNode.id : null
      };
      
      if (path.id) {
        await updateDoc(doc(this.db, 'learningPaths', path.id), pathData);
      } else {
        const newDocRef = doc(collection(this.db, 'learningPaths'));
        path.id = newDocRef.id;
        await setDoc(newDocRef, {
          id: path.id,
          ...pathData
        });
      }
      
      // Update cache
      this.cache.learningPaths.set(path.id, path);
      return path;
    } catch (error) {
      console.error('Error saving learning path:', error);
      return null;
    }
  }

  // Update a learning path with new data
  async updateLearningPath(pathId, updates) {
    try {
      // Get current path
      const path = this.cache.learningPaths.get(pathId);
      
      if (!path) {
        const pathDoc = await getDoc(doc(this.db, 'learningPaths', pathId));
        if (!pathDoc.exists()) {
          throw new Error('Learning path not found');
        }
        
        path = new LearningPath({
          id: pathDoc.id,
          ...pathDoc.data()
        });
        
        this.cache.learningPaths.set(pathId, path);
      }
      
      // Apply updates
      Object.keys(updates).forEach(key => {
        if (key !== 'id' && key !== 'userId') {
          path[key] = updates[key];
        }
      });
      
      path.updatedAt = new Date();
      
      // Save to Firestore
      await updateDoc(doc(this.db, 'learningPaths', pathId), {
        ...updates,
        updatedAt: path.updatedAt
      });
      
      // Update cache
      this.cache.learningPaths.set(pathId, path);
      return path;
    } catch (error) {
      console.error('Error updating learning path:', error);
      return null;
    }
  }

  // ===== AI-powered curriculum generation =====

  // Generate a personalized curriculum path
  async generatePersonalizedPath(userId, goalId) {
    try {
      // Get learner profile
      const learnerProfile = await this.getLearnerProfile(userId);
      if (!learnerProfile) throw new Error('Learner profile not found');
      
      // Get goal details
      const goalDoc = await getDoc(doc(this.db, 'curriculumGoals', goalId));
      if (!goalDoc.exists()) throw new Error('Goal not found');
      
      const goal = goalDoc.data();
      
      // Create a new path
      const path = new LearningPath({
        userId,
        title: `Personalized Path: ${goal.title}`,
        description: `Custom learning path for ${goal.title}`,
        goals: [goal],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Get relevant curriculum nodes
      const nodes = await this.getCurriculumNodesForGoal(goalId);
      
      // Analyze skill gaps
      const skillGaps = await this.analyzeSkillGaps(learnerProfile, goal.requiredSkills);
      
      // Create personalized curriculum
      const { curriculumNodes, curriculumEdges } = await this.createPersonalizedCurriculum(
        nodes, 
        skillGaps, 
        learnerProfile
      );
      
      // Add to path
      path.nodes = curriculumNodes;
      path.edges = curriculumEdges;
      
      // Calculate estimated completion time
      path.estimatedCompletion = this.calculateEstimatedCompletion(
        curriculumNodes, 
        learnerProfile.availableTime
      );
      
      // Save path
      return this.saveLearningPath(path);
    } catch (error) {
      console.error('Error generating personalized path:', error);
      return null;
    }
  }

  // Get curriculum nodes for a specific goal
  async getCurriculumNodesForGoal(goalId) {
    try {
      const goalDoc = await getDoc(doc(this.db, 'curriculumGoals', goalId));
      if (!goalDoc.exists()) throw new Error('Goal not found');
      
      const goal = goalDoc.data();
      
      // Get nodes that teach required skills
      const nodes = [];
      
      for (const skillId of goal.requiredSkills) {
        const skillNodesQuery = query(
          collection(this.db, 'curriculumNodes'),
          where('skills', 'array-contains', skillId)
        );
        
        const querySnapshot = await getDocs(skillNodesQuery);
        
        querySnapshot.forEach(doc => {
          const nodeData = doc.data();
          nodes.push(new CurriculumNode({
            id: doc.id,
            ...nodeData
          }));
        });
      }
      
      return nodes;
    } catch (error) {
      console.error('Error fetching curriculum nodes for goal:', error);
      return [];
    }
  }

  // Analyze skill gaps between learner profile and required skills
  async analyzeSkillGaps(learnerProfile, requiredSkills) {
    const skillGaps = {};
    
    for (const skillId of requiredSkills) {
      const currentLevel = learnerProfile.getSkillProficiency(skillId);
      const requiredLevel = 0.7; // 70% proficiency required
      
      if (currentLevel < requiredLevel) {
        skillGaps[skillId] = {
          currentLevel,
          requiredLevel,
          gap: requiredLevel - currentLevel
        };
      }
    }
    
    return skillGaps;
  }

  // Create a personalized curriculum based on skill gaps and learner profile
  async createPersonalizedCurriculum(nodes, skillGaps, learnerProfile) {
    // Sort nodes by relevance to skill gaps
    const scoredNodes = nodes.map(node => {
      let relevanceScore = 0;
      
      // Calculate relevance based on skill gaps
      node.skills.forEach(skillId => {
        if (skillGaps[skillId]) {
          relevanceScore += skillGaps[skillId].gap * this.config.skillGapWeight;
        }
      });
      
      // Adjust for learning preferences
      const styleMatch = node.learningStyles.filter(
        style => learnerProfile.preferredLearningStyles.includes(style)
      ).length;
      
      relevanceScore += (styleMatch / node.learningStyles.length) * this.config.personalizationWeight;
      
      // Adjust for interests
      const interestMatch = node.metadata.topics ? 
        node.metadata.topics.filter(topic => learnerProfile.interests.includes(topic)).length : 0;
      
      if (node.metadata.topics && node.metadata.topics.length > 0) {
        relevanceScore += (interestMatch / node.metadata.topics.length) * this.config.interestWeight;
      }
      
      return {
        node,
        relevanceScore
      };
    });
    
    // Sort by relevance
    scoredNodes.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Create dependencies between nodes
    const curriculumNodes = [];
    const curriculumEdges = [];
    const nodeMap = new Map();
    
    // First pass: collect relevant nodes
    for (const { node } of scoredNodes) {
      // Skip duplicates or extremely low relevance
      if (nodeMap.has(node.id)) continue;
      
      nodeMap.set(node.id, node);
      curriculumNodes.push(node);
      
      // Limit number of nodes
      if (curriculumNodes.length >= this.config.learningSizeLimit) break;
    }
    
    // Second pass: create edges based on prerequisites
    for (const node of curriculumNodes) {
      for (const prereqId of node.prerequisites) {
        // Check if prerequisite is in our node set
        if (nodeMap.has(prereqId)) {
          curriculumEdges.push({
            source: prereqId,
            target: node.id,
            type: 'prerequisite'
          });
        }
      }
    }
    
    // Create edges for skill progression (skills not covered by prerequisites)
    const skillNodeMap = new Map();
    
    // Map skills to nodes
    curriculumNodes.forEach(node => {
      node.skills.forEach(skillId => {
        if (!skillNodeMap.has(skillId)) {
          skillNodeMap.set(skillId, []);
        }
        skillNodeMap.get(skillId).push(node.id);
      });
    });
    
    // Connect nodes teaching the same skill, from lower to higher difficulty
    for (const [skillId, nodeIds] of skillNodeMap.entries()) {
      if (nodeIds.length < 2) continue;
      
      const skillNodes = nodeIds.map(id => nodeMap.get(id))
        .sort((a, b) => {
          const difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
          return difficultyLevels.indexOf(a.difficulty) - difficultyLevels.indexOf(b.difficulty);
        });
      
      for (let i = 0; i < skillNodes.length - 1; i++) {
        const edge = {
          source: skillNodes[i].id,
          target: skillNodes[i + 1].id,
          type: 'progression'
        };
        
        // Check if edge already exists (avoid duplicates)
        const edgeExists = curriculumEdges.some(e => 
          e.source === edge.source && e.target === edge.target
        );
        
        if (!edgeExists) {
          curriculumEdges.push(edge);
        }
      }
    }
    
    return { curriculumNodes, curriculumEdges };
  }

  // Calculate estimated completion time
  calculateEstimatedCompletion(nodes, availableTime) {
    const totalDuration = nodes.reduce((sum, node) => sum + node.estimatedDuration, 0);
    const dailyTimeMinutes = availableTime.daily || 60;
    
    // Calculate days to completion
    const daysToCompletion = Math.ceil(totalDuration / dailyTimeMinutes);
    
    // Get estimated completion date
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToCompletion);
    
    return {
      totalDuration,
      daysToCompletion,
      completionDate
    };
  }

  // ===== Recommendation and personalization =====

  // Get content recommendations based on learner progress
  async getRecommendations(userId, pathId, limit = 3) {
    try {
      // Get learner profile and path
      const learnerProfile = await this.getLearnerProfile(userId);
      if (!learnerProfile) throw new Error('Learner profile not found');
      
      let path;
      if (pathId) {
        path = this.cache.learningPaths.get(pathId);
        if (!path) {
          const pathDoc = await getDoc(doc(this.db, 'learningPaths', pathId));
          if (!pathDoc.exists()) throw new Error('Learning path not found');
          
          path = new LearningPath({
            id: pathDoc.id,
            ...pathDoc.data()
          });
          
          this.cache.learningPaths.set(pathId, path);
        }
      } else {
        // Get most recent active path
        const paths = await this.getLearningPaths(userId);
        path = paths.find(p => p.status === 'active') || paths[0];
        
        if (!path) throw new Error('No active learning path found');
      }
      
      // Get next nodes based on current position
      const nextNodes = this.getNextNodes(path, limit);
      
      // Rank by relevance and adjust difficulty
      const recommendations = this.rankAndAdjustRecommendations(
        nextNodes, 
        learnerProfile
      );
      
      // Track analytics
      this.analytics.recommendationCount++;
      
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  // Get next nodes from learning path
  getNextNodes(path, limit) {
    // If no current node, get the root nodes
    if (!path.currentNode) {
      // Find root nodes (nodes with no incoming edges)
      const rootNodeIds = path.nodes
        .filter(node => !path.edges.some(edge => edge.target === node.id))
        .map(node => node.id);
      
      return path.nodes
        .filter(node => rootNodeIds.includes(node.id))
        .slice(0, limit);
    }
    
    // Find nodes connected to current node
    const currentNodeId = typeof path.currentNode === 'string' 
      ? path.currentNode 
      : path.currentNode.id;
    
    const outgoingEdges = path.edges.filter(edge => 
      edge.source === currentNodeId && 
      !path.nodes.find(n => n.id === edge.target)?.metadata?.completed
    );
    
    const nextNodeIds = outgoingEdges.map(edge => edge.target);
    
    return path.nodes
      .filter(node => nextNodeIds.includes(node.id))
      .slice(0, limit);
  }

  // Rank and adjust recommendations based on learner profile
  rankAndAdjustRecommendations(nodes, learnerProfile) {
    // Apply personalization factors
    const recommendations = nodes.map(node => {
      // Calculate base relevance
      let relevance = 1.0;
      
      // Adjust for learning style preference
      const styleMatch = node.learningStyles.filter(
        style => learnerProfile.preferredLearningStyles.includes(style)
      ).length;
      
      if (node.learningStyles.length > 0) {
        relevance *= (1 + (styleMatch / node.learningStyles.length) * this.config.personalizationWeight);
      }
      
      // Adjust for content type preference
      const contentMatch = node.content.filter(content =>
        learnerProfile.preferredContentTypes.includes(content.type)
      ).length;
      
      if (node.content.length > 0) {
        relevance *= (1 + (contentMatch / node.content.length) * this.config.personalizationWeight);
      }
      
      // Adjust difficulty if adaptive difficulty is enabled
      let adjustedNode = { ...node };
      
      if (this.config.adaptiveDifficulty) {
        adjustedNode = this.adjustNodeDifficulty(node, learnerProfile);
      }
      
      return {
        ...adjustedNode,
        relevance
      };
    });
    
    // Sort by relevance
    recommendations.sort((a, b) => b.relevance - a.relevance);
    
    return recommendations;
  }

  // Adjust node difficulty based on learner profile
  adjustNodeDifficulty(node, learnerProfile) {
    const adjustedNode = { ...node };
    
    // Check proficiency in the skills this node teaches
    const skillProficiencies = node.skills.map(skillId => 
      learnerProfile.getSkillProficiency(skillId)
    );
    
    // Calculate average proficiency
    const avgProficiency = skillProficiencies.length > 0
      ? skillProficiencies.reduce((sum, val) => sum + val, 0) / skillProficiencies.length
      : 0;
    
    // Adjust content based on proficiency
    if (avgProficiency < 0.3) {
      // Beginner - add more explanations
      adjustedNode.content = this.addMoreExplanations(node.content);
      
      // Simplify assessments
      adjustedNode.assessments = this.simplifyAssessments(node.assessments);
      
    } else if (avgProficiency > 0.7) {
      // Advanced - add more challenges
      adjustedNode.content = this.addMoreChallenges(node.content);
      
      // Make assessments more challenging
      adjustedNode.assessments = this.enhanceAssessments(node.assessments);
    }
    
    return adjustedNode;
  }

  // Add more explanations to content for beginners
  addMoreExplanations(content) {
    return content.map(item => {
      if (item.type === 'text' || item.type === 'video') {
        return {
          ...item,
          additionalResources: [
            ...(item.additionalResources || []),
            {
              type: 'explanation',
              title: 'Detailed Explanation',
              description: 'An in-depth explanation with examples'
            }
          ]
        };
      }
      return item;
    });
  }

  // Add more challenges for advanced learners
  addMoreChallenges(content) {
    return [
      ...content,
      {
        type: 'challenge',
        title: 'Advanced Challenge',
        description: 'Test your skills with this advanced challenge',
        difficulty: 'advanced'
      }
    ];
  }

  // Simplify assessments for beginners
  simplifyAssessments(assessments) {
    return assessments.map(assessment => ({
      ...assessment,
      timeLimit: assessment.timeLimit * 1.5, // Give 50% more time
      passingScore: Math.max(0.6, assessment.passingScore - 0.1) // Lower passing score slightly
    }));
  }

  // Make assessments more challenging for advanced learners
  enhanceAssessments(assessments) {
    return assessments.map(assessment => ({
      ...assessment,
      timeLimit: assessment.timeLimit * 0.8, // Give 20% less time
      passingScore: Math.min(0.9, assessment.passingScore + 0.1) // Raise passing score slightly
    }));
  }

  // ===== Skill gap analysis and adaptive assessment =====

  // Perform a skill gap analysis for a learner
  async analyzeSkillGapsForLearner(userId, targetSkills = null) {
    try {
      // Get learner profile
      const learnerProfile = await this.getLearnerProfile(userId);
      if (!learnerProfile) throw new Error('Learner profile not found');
      
      // Get all skills if targetSkills not provided
      let skills = targetSkills;
      
      if (!skills) {
        // Get from skill taxonomy
        if (!this.skillTaxonomy) {
          await this.loadSkillTaxonomy();
        }
        
        skills = this.skillTaxonomy.skills.map(skill => skill.id);
      }
      
      // Analyze gaps
      const gaps = {};
      const strengths = {};
      
      for (const skillId of skills) {
        const proficiency = learnerProfile.getSkillProficiency(skillId);
        
        // Threshold for gap identification
        if (proficiency < 0.5) {
          gaps[skillId] = {
            skillId,
            currentLevel: proficiency,
            targetLevel: 0.7,
            gap: 0.7 - proficiency
          };
        } 
        // Threshold for strength identification
        else if (proficiency > 0.8) {
          strengths[skillId] = {
            skillId,
            level: proficiency
          };
        }
      }
      
      // Update learner profile with identified gaps and strengths
      learnerProfile.weaknesses = Object.keys(gaps);
      learnerProfile.strengths = Object.keys(strengths);
      
      await this.saveLearnerProfile(learnerProfile);
      
      return {
        gaps: Object.values(gaps),
        strengths: Object.values(strengths),
        profile: learnerProfile
      };
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      return { gaps: [], strengths: [], profile: null };
    }
  }

  // Generate an adaptive assessment for a learner
  async generateAdaptiveAssessment(userId, skillIds) {
    try {
      // Get learner profile
      const learnerProfile = await this.getLearnerProfile(userId);
      if (!learnerProfile) throw new Error('Learner profile not found');
      
      // Get assessment questions for each skill
      const questions = await this.getAssessmentQuestionsForSkills(skillIds);
      
      // Adjust difficulty based on learner profile
      const adaptedQuestions = this.adaptQuestionsToLearner(questions, learnerProfile);
      
      // Create assessment
      const assessment = {
        id: `assessment_${Date.now()}`,
        userId,
        title: 'Adaptive Skill Assessment',
        description: 'This assessment is tailored to your skill level',
        questions: adaptedQuestions,
        skillsCovered: skillIds,
        timeLimit: adaptedQuestions.length * 2 * 60, // 2 minutes per question
        passingScore: 0.7,
        createdAt: new Date()
      };
      
      // Save assessment to Firestore
      await setDoc(doc(this.db, 'assessments', assessment.id), assessment);
      
      return assessment;
    } catch (error) {
      console.error('Error generating adaptive assessment:', error);
      return null;
    }
  }

  // Get assessment questions for skills
  async getAssessmentQuestionsForSkills(skillIds) {
    try {
      const questions = [];
      
      for (const skillId of skillIds) {
        const questionsQuery = query(
          collection(this.db, 'assessmentQuestions'),
          where('skills', 'array-contains', skillId)
        );
        
        const querySnapshot = await getDocs(questionsQuery);
        
        querySnapshot.forEach(doc => {
          questions.push({
            id: doc.id,
            ...doc.data()
          });
        });
      }
      
      return questions;
    } catch (error) {
      console.error('Error fetching assessment questions:', error);
      return [];
    }
  }

  // Adapt questions to learner's skill level
  adaptQuestionsToLearner(questions, learnerProfile) {
    // Group questions by skill and difficulty
    const questionsBySkill = {};
    
    questions.forEach(question => {
      question.skills.forEach(skillId => {
        if (!questionsBySkill[skillId]) {
          questionsBySkill[skillId] = {
            beginner: [],
            intermediate: [],
            advanced: [],
            expert: []
          };
        }
        
        questionsBySkill[skillId][question.difficulty].push(question);
      });
    });
    
    // Select questions based on skill proficiency
    const selectedQuestions = [];
    
    Object.keys(questionsBySkill).forEach(skillId => {
      const proficiency = learnerProfile.getSkillProficiency(skillId);
      let targetDifficulties;
      
      if (proficiency < 0.3) {
        targetDifficulties = ['beginner', 'intermediate'];
      } else if (proficiency < 0.6) {
        targetDifficulties = ['intermediate', 'advanced'];
      } else {
        targetDifficulties = ['advanced', 'expert'];
      }
      
      // Select up to 3 questions per skill
      const skillQuestions = [];
      
      targetDifficulties.forEach(difficulty => {
        const availableQuestions = questionsBySkill[skillId][difficulty];
        
        if (availableQuestions && availableQuestions.length > 0) {
          // Shuffle and select up to 2 questions per difficulty
          const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
          skillQuestions.push(...shuffled.slice(0, 2));
        }
      });
      
      // Limit to 3 questions per skill
      selectedQuestions.push(...skillQuestions.slice(0, 3));
    });
    
    // Deduplicate questions (a question might cover multiple skills)
    const uniqueQuestions = [];
    const seenIds = new Set();
    
    selectedQuestions.forEach(question => {
      if (!seenIds.has(question.id)) {
        seenIds.add(question.id);
        uniqueQuestions.push(question);
      }
    });
    
    return uniqueQuestions;
  }

  // Process assessment results and update learner profile
  async processAssessmentResults(userId, assessmentId, answers) {
    try {
      // Get assessment
      const assessmentDoc = await getDoc(doc(this.db, 'assessments', assessmentId));
      if (!assessmentDoc.exists()) throw new Error('Assessment not found');
      
      const assessment = assessmentDoc.data();
      
      // Grade assessment
      const results = this.gradeAssessment(assessment, answers);
      
      // Get learner profile
      const learnerProfile = await this.getLearnerProfile(userId);
      if (!learnerProfile) throw new Error('Learner profile not found');
      
      // Update skill proficiencies based on results
      const skillUpdates = {};
      
      results.questionResults.forEach(result => {
        result.question.skills.forEach(skillId => {
          if (!skillUpdates[skillId]) {
            skillUpdates[skillId] = { 
              correct: 0, 
              total: 0,
              proficiencyDelta: 0 
            };
          }
          
          skillUpdates[skillId].total++;
          
          if (result.correct) {
            skillUpdates[skillId].correct++;
          }
        });
      });
      
      // Calculate proficiency changes
      Object.keys(skillUpdates).forEach(skillId => {
        const update = skillUpdates[skillId];
        const correctRatio = update.correct / update.total;
        
        // Adjust proficiency based on performance
        // Correct answers increase proficiency, incorrect decrease
        const baseDelta = correctRatio - 0.5; // -0.5 to +0.5 range
        update.proficiencyDelta = baseDelta * 0.2; // Scale to -0.1 to +0.1
        
        // Update learner profile
        learnerProfile.updateSkill(skillId, update.proficiencyDelta);
      });
      
      // Save assessment results
      const resultRecord = {
        assessmentId,
        timestamp: new Date(),
        score: results.score,
        passing: results.passing,
        skillResults: Object.keys(skillUpdates).map(skillId => ({
          skillId,
          correct: skillUpdates[skillId].correct,
          total: skillUpdates[skillId].total,
          proficiencyDelta: skillUpdates[skillId].proficiencyDelta
        }))
      };
      
      learnerProfile.assessmentResults.push(resultRecord);
      
      // Save updated learner profile
      await this.saveLearnerProfile(learnerProfile);
      
      return {
        ...results,
        skillUpdates: Object.keys(skillUpdates).map(skillId => ({
          skillId,
          name: this.getSkillName(skillId),
          correct: skillUpdates[skillId].correct,
          total: skillUpdates[skillId].total,
          proficiencyDelta: skillUpdates[skillId].proficiencyDelta,
          newLevel: learnerProfile.getSkillProficiency(skillId)
        }))
      };
    } catch (error) {
      console.error('Error processing assessment results:', error);
      return null;
    }
  }

  // Grade an assessment
  gradeAssessment(assessment, answers) {
    const questionResults = assessment.questions.map(question => {
      const userAnswer = answers[question.id];
      let correct = false;
      
      switch (question.type) {
        case 'multiple-choice':
          correct = userAnswer === question.correctAnswer;
          break;
        case 'multiple-select':
          correct = this.arraysEqual(userAnswer, question.correctAnswers);
          break;
        case 'true-false':
          correct = userAnswer === question.correctAnswer;
          break;
        case 'code':
          // For code questions, we would need a more sophisticated evaluation
          // This is a simplified version
          correct = userAnswer.includes(question.keyElements);
          break;
        default:
          correct = false;
      }
      
      return {
        questionId: question.id,
        question,
        userAnswer,
        correct,
        correctAnswer: question.correctAnswer || question.correctAnswers
      };
    });
    
    // Calculate overall score
    const correctCount = questionResults.filter(result => result.correct).length;
    const score = correctCount / questionResults.length;
    
    // Check if passing
    const passing = score >= assessment.passingScore;
    
    return {
      assessmentId: assessment.id,
      score,
      passing,
      questionResults
    };
  }

  // Helper to check array equality
  arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    
    for (let i = 0; i < sortedA.length; i++) {
      if (sortedA[i] !== sortedB[i]) {
        return false;
      }
    }
    
    return true;
  }

  // Get skill name from taxonomy
  getSkillName(skillId) {
    if (!this.skillTaxonomy) return skillId;
    
    const skill = this.skillTaxonomy.skills.find(s => s.id === skillId);
    return skill ? skill.name : skillId;
  }

  // ===== Learning path visualization and progress tracking =====

  // Generate a visual representation of a learning path
  generatePathVisualization(path) {
    // In a real implementation, this would generate data for a visualization
    // Here we'll return a simplified representation
    
    const nodes = path.nodes.map(node => ({
      id: node.id,
      label: node.title,
      type: node.type,
      difficulty: node.difficulty,
      completed: node.metadata.completed || false,
      skills: node.skills,
      estimatedDuration: node.estimatedDuration
    }));
    
    const edges = path.edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      type: edge.type
    }));
    
    // Calculate progress statistics
    const totalNodes = nodes.length;
    const completedNodes = nodes.filter(node => node.completed).length;
    const progress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
    
    // Calculate estimated time to completion
    const remainingNodes = nodes.filter(node => !node.completed);
    const remainingTime = remainingNodes.reduce((sum, node) => sum + node.estimatedDuration, 0);
    
    return {
      nodes,
      edges,
      statistics: {
        totalNodes,
        completedNodes,
        progress,
        remainingTime
      },
      currentNode: path.currentNode
    };
  }

  // Track learner progress and update analytics
  async trackProgress(userId, nodeId, completed = true) {
    try {
      // Get learner profile
      const learnerProfile = await this.getLearnerProfile(userId);
      if (!learnerProfile) throw new Error('Learner profile not found');
      
      // Find paths containing this node
      const paths = await this.getLearningPaths(userId);
      const relevantPaths = paths.filter(path => 
        path.nodes.some(node => node.id === nodeId)
      );
      
      if (relevantPaths.length === 0) {
        throw new Error('Node not found in any learning path');
      }
      
      // Update node completion status in all relevant paths
      const updates = [];
      
      for (const path of relevantPaths) {
        const nodeIndex = path.nodes.findIndex(node => node.id === nodeId);
        
        if (nodeIndex !== -1) {
          // Create a copy of the node and update its metadata
          const updatedNode = {
            ...path.nodes[nodeIndex],
            metadata: {
              ...path.nodes[nodeIndex].metadata,
              completed,
              completedAt: completed ? new Date() : null
            }
          };
          
          // Update node in path
          path.nodes[nodeIndex] = updatedNode;
          
          // If completing, add to learner's completed modules
          if (completed && !learnerProfile.completedModules.includes(nodeId)) {
            learnerProfile.completedModules.push(nodeId);
            
            // Record in learning history
            learnerProfile.learningHistory.push({
              nodeId,
              completedAt: new Date(),
              pathId: path.id
            });
          }
          
          // Update current node if needed
          if (path.currentNode && 
              (typeof path.currentNode === 'string' ? 
                path.currentNode === nodeId : 
                path.currentNode.id === nodeId) && 
              completed) {
            
            // Set next node as current
            const nextNode = this.getNextNodes(path, 1)[0];
            path.currentNode = nextNode || null;
          }
          
          // Recalculate progress
          path.progress = path.calculateProgress();
          
          // Add to updates
          updates.push(this.saveLearningPath(path));
        }
      }
      
      // Save learner profile
      await this.saveLearnerProfile(learnerProfile);
      
      // Wait for all path updates
      await Promise.all(updates);
      
      // Update analytics
      if (completed) {
        // Track path completion rate
        const completedPaths = paths.filter(path => path.progress === 100);
        this.analytics.pathCompletionRate = paths.length > 0 ? 
          completedPaths.length / paths.length : 0;
      }
      
      return {
        success: true,
        updatedPaths: relevantPaths.map(path => path.id)
      };
    } catch (error) {
      console.error('Error tracking progress:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== Topic clustering and knowledge mapping =====

  // Generate a knowledge map for a set of skills
  async generateKnowledgeMap(skillIds) {
    try {
      if (!this.skillTaxonomy) {
        await this.loadSkillTaxonomy();
      }
      
      if (!this.skillTaxonomy) {
        throw new Error('Skill taxonomy not available');
      }
      
      // Get skills from taxonomy
      const skills = skillIds.map(id => {
        const skill = this.skillTaxonomy.skills.find(s => s.id === id);
        return skill || { id, name: id };
      });
      
      // Get relationships between skills
      const relationships = this.skillTaxonomy.relationships.filter(rel => 
        skillIds.includes(rel.source) && skillIds.includes(rel.target)
      );
      
      // Create clusters based on skill categories
      const clusters = {};
      
      skills.forEach(skill => {
        const category = skill.category || 'uncategorized';
        
        if (!clusters[category]) {
          clusters[category] = {
            id: category,
            name: this.skillTaxonomy.categories?.[category]?.name || category,
            skills: []
          };
        }
        
        clusters[category].skills.push(skill);
      });
      
      return {
        skills,
        relationships,
        clusters: Object.values(clusters)
      };
    } catch (error) {
      console.error('Error generating knowledge map:', error);
      return { skills: [], relationships: [], clusters: [] };
    }
  }

  // Cluster content by topic and difficulty
  clusterContentByTopic(nodes) {
    // Extract topics from nodes
    const topicMap = new Map();
    
    nodes.forEach(node => {
      if (node.metadata.topics) {
        node.metadata.topics.forEach(topic => {
          if (!topicMap.has(topic)) {
            topicMap.set(topic, []);
          }
          
          topicMap.get(topic).push(node);
        });
      }
    });
    
    // Create clusters
    const clusters = [];
    
    for (const [topic, topicNodes] of topicMap.entries()) {
      // Group by difficulty within topic
      const difficultyGroups = {
        beginner: [],
        intermediate: [],
        advanced: [],
        expert: []
      };
      
      topicNodes.forEach(node => {
        difficultyGroups[node.difficulty].push(node);
      });
      
      clusters.push({
        topic,
        count: topicNodes.length,
        difficulties: Object.keys(difficultyGroups)
          .filter(diff => difficultyGroups[diff].length > 0)
          .map(diff => ({
            level: diff,
            nodes: difficultyGroups[diff]
          }))
      });
    }
    
    return clusters;
  }

  // ===== Multi-modal learning support =====

  // Generate curriculum nodes for different learning styles
  async generateMultiModalContent(concept, learningStyles = null) {
    // If no learning styles specified, generate for all styles
    if (!learningStyles) {
      learningStyles = ['visual', 'auditory', 'reading/writing', 'kinesthetic'];
    }
    
    // Content templates for different learning styles
    const contentTemplates = {
      visual: [
        { type: 'video', title: `${concept} Visualization` },
        { type: 'diagram', title: `${concept} Diagram` },
        { type: 'infographic', title: `${concept} at a Glance` }
      ],
      auditory: [
        { type: 'podcast', title: `${concept} Explained` },
        { type: 'audio', title: `${concept} Audio Lecture` },
        { type: 'discussion', title: `${concept} Discussion` }
      ],
      'reading/writing': [
        { type: 'article', title: `${concept} Comprehensive Guide` },
        { type: 'notes', title: `${concept} Key Points` },
        { type: 'case-study', title: `${concept} in Practice` }
      ],
      kinesthetic: [
        { type: 'interactive', title: `${concept} Interactive Demo` },
        { type: 'exercise', title: `${concept} Hands-on Exercise` },
        { type: 'project', title: `${concept} Mini-Project` }
      ]
    };
    
    // Generate content for each requested learning style
    const multiModalContent = {};
    
    learningStyles.forEach(style => {
      if (contentTemplates[style]) {
        multiModalContent[style] = contentTemplates[style].map(template => ({
          ...template,
          description: `${template.title} for ${style} learners`,
          // In a real implementation, we might use AI to generate actual content
          // or retrieve it from a content database
          placeholder: true
        }));
      }
    });
    
    return {
      concept,
      learningStyles,
      content: multiModalContent
    };
  }
}

export default CurriculumAI;
export { LearnerProfile, LearningPath, CurriculumNode, LearningModel };