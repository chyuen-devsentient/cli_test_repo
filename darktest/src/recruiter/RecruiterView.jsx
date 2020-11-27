import { useQuery } from '@apollo/client';
import { Affix, BackTop, Col, notification, Row, Skeleton, Spin } from 'antd';
import { gql } from 'apollo-boost';
import React, { useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { SearchContext } from '../App';
import HorizontalBaseballCard from '../components/HorizontalBaseballCard';
import SortableList from '../components/SortableList';
import { nanoid } from 'nanoid'

const COMPONENT_QUERY = gql`
  query Query(
    $generalStatsOrderBy: [GeneralStatOrderByInput!]
    $generalStatsWhere: GeneralStatWhereInput
    $generalStatsFirst: Int
    $generalStatsAfter: GeneralStatWhereUniqueInput
  ) {
    generalStats(
      orderBy: $generalStatsOrderBy
      where: $generalStatsWhere
      first: $generalStatsFirst
      after: $generalStatsAfter
    ) {
      id
      superAuthorId
    }
  }
`;

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};

const SearchSortFilter = React.createContext();

const mapName = {
  skill_perc_interactive: 'Interactive',
  skill_perc_UI: 'UI',
  skill_perc_auth: 'Auth',
  skill_perc_math: 'Math',
  skill_perc_server: 'Server',
  skill_perc_event_handling: 'Event Handling',
  skill_perc_databases: 'Databases',
  skill_perc_state_management: 'State Management',
  skill_perc_api_calls: 'API Calls',
  skill_perc_map_reduce: 'Map Reduce',
};

const fixedData = Object.values(mapName).map((item, i) => {
  return {
    key: item,
    stat: {
      name: item,
      enabled: false,
    },
    index: i,
  };
});
fixedData.slice(0, 6).forEach((item) => {
  item.stat.enabled = true;
});

function RecruiterView() {
  const queryVarsInit = {
    generalStatsAfter: null,
    generalStatsOrderBy: [
      {
        value: 'desc',
      },
    ],
    generalStatsWhere: {
      statType: { equals: 'totalEssentialLinesAdded' },
    },
    generalStatsFirst: 10,
  };
  const [idList, setIdList] = useState(null);
  const scrollRef = useRef(null);
  const [sortTableData, setSortTableData] = useState(fixedData);
  const [scrollerId, setScrollerId] = useState(nanoid());
  const [queryVars, setQueryVars] = useState(queryVarsInit);
  const sortableList = (
    <SortableList tableDataState={[sortTableData, setSortTableData]} />
  );

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch: queryRefetch,
  } = useQuery(COMPONENT_QUERY, {
    variables: queryVars,
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (!!!queryData) {
      return;
    }
    console.log('queryData', queryData);
    let prevIdList = idList;
    if (!prevIdList) {
      prevIdList = [];
    }

    setIdList(prevIdList.concat(queryData.generalStats));
    return () => {
      // cleanup
    };
  }, [queryData]);

  useEffect(() => {
    console.log("queryVars changed. refetching.", queryVars);
    queryRefetch(queryVars);
  }, [scrollerId]);

  // if (!!!idList) {
  //   return (
  //     <div>
  //       <Skeleton active />
  //     </div>
  //   );
  // }

  const loadFunc = (page) => {
    if (queryLoading || !!!idList || idList.length == 0) {
      return;
    }

    const queryVarsCopy = queryVars;
    queryVarsCopy['generalStatsAfter'] = { id: idList[idList.length - 1].id };
    console.log('page', page, queryVarsCopy);
    queryRefetch(queryVarsCopy);
  };

  if (queryError) {
    openNotificationWithIcon(
      'error',
      'Internal Error',
      'We encountered an internal error. Please contact support@devsentient.com',
    );
    console.log('Query error:', queryError);
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  const baseballCards = idList && idList.map((item) => {
    return (
      <div>
        <HorizontalBaseballCard
          searchId={item.superAuthorId}
          showLink={true}
          compact={true}
          sortTableData={sortTableData}
        />
      </div>
    );
  });
  console.log("idList", idList);
  return (
    <div>
      <Row>
        <Col span={19} ref={scrollRef} id={"mainCol"}>
          {idList && (idList.length > 0) && (
            <InfiniteScroll
              key={scrollerId}
              pageStart={0}
              loadMore={loadFunc}
              hasMore={true || false}
              initialLoad={false}
              useWindow={true}
            >
              <div style={{height: "100%"}}>
                {baseballCards}
              </div>
            </InfiniteScroll>
          )}

          {!!!idList && (
            <Spin
              style={{
                marginTop: '20%',
              }}
              size="large"
            />
          )}
        </Col>
        <Col span={5}>
          <Row>
            <SearchSortFilter.Provider
              value={[
                queryVars,
                setQueryVars,
                queryRefetch,
                setIdList,
                setScrollerId
              ]}
            >
              {sortableList}
            </SearchSortFilter.Provider>
          </Row>
        </Col>
      </Row>
      <BackTop />
    </div>
  );
}

export default RecruiterView;

export { SearchSortFilter };
