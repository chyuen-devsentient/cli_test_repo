import { gql } from "apollo-boost";

const GET_ESSENTIAL_LINES = gql`
  query {
    essentialLinesCounts (first: 5){
      author{
        name
      }
      authorID
      essentialLinesInserted
      date
    }
  }
`;

const GET_AUTHOR = gql`
  query ($id: String!){
    superAuthor(where: {
      id: $id
    }){
      id
      displayName
      displayEmail
      authors{
        id
        name
        email
        skills{
          skill
          sentenceCount
        }
        parentRepoId
        parentRepo {
          remoteUrl
        }
        essentialLinesCount{
          essentialLinesInserted
          date
        }
      }      
    }
  }
`;

const GET_AUTHORS = gql`
  query {
    superAuthors(first:5) {
      id
      displayName
      displayEmail
    }
  }
`;


const GET_LINES_ADDED = gql `
  query ($id: String!, $startDate: DateTime){
    linesAddedStats (where: {
      superAuthorId: {equals: $id}
      repoID: {equals: "OVERALL"}
      date: {gte: $startDate}
    } ){
      lineType
      numLines
      date
    }
  }
`;

const GET_SKILL_RADAR = gql`
  query ($id: String! $timeframe: String!){
    skillStats (where: {
      superAuthorId: {equals: $id}
      timeframe: {equals: $timeframe}      
    } 
     orderBy: {date: desc} first:11) {
      skill
      sentenceCount
      timeframe
    }
  }
`;

const GET_SURVIVAL_STAT = gql`
  query Query($codeSurvivalStatsFirst: Int, $codeSurvivalStatsOrderBy: [CodeSurvivalStatOrderByInput!], $codeSurvivalStatsWhere: CodeSurvivalStatWhereInput) {
    codeSurvivalStats(first: $codeSurvivalStatsFirst, orderBy: $codeSurvivalStatsOrderBy, where: $codeSurvivalStatsWhere) {
      numLines
      date
      survivalStat
      superAuthor {
        displayName
      }
    }
  }
`;

const GET_GENERAL_STAT = gql`
  query ($id: String!){
    generalStats (where: {
      superAuthorId: {equals: $id}
    } orderBy: {timestamp: desc} first:30 ){
    statType
    value
    }
  }
`;

const LAST_ACTIVE = gql`
  query ($id: String!){
    linesAddedStats (where: {
      superAuthorId: {equals: $id}
    } orderBy: {date: asc} last:1) {
      date
    }
  }
`;


const CODE_EXAMPLE = gql`
  query ($id: String! $yesterday: DateTime){
    codeExamples (where: {
      superAuthorId: {equals: $id}
      timestamp: {gte: $yesterday}      
    } orderBy: {timestamp: desc}){
    skill
    codeSentence
  }
  }
`;

export  {
  GET_ESSENTIAL_LINES,
  GET_AUTHOR,
  GET_AUTHORS,
  GET_LINES_ADDED,
  GET_SURVIVAL_STAT,
  GET_GENERAL_STAT,
  GET_SKILL_RADAR,
  LAST_ACTIVE,
  CODE_EXAMPLE,
}