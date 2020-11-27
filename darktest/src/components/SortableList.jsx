import React, { useContext, useState } from 'react';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {
  Affix,
  Button,
  Card,
  Col,
  Radio,
  Row,
  Slider,
  Space,
  Switch,
  Table,
} from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Text from 'antd/lib/typography/Text';
import { SearchSortFilter } from '../recruiter/RecruiterView';
import { nanoid } from 'nanoid';
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const mapName = {
  skill_perc_interactive: 'Interactive',
  skill_perc_UI: 'UI',
  skill_perc_auth: 'Auth',
  skill_perc_math: 'Math',
  skill_perc_server: 'Server',
  skill_perc_noSkill: 'General',
  skill_perc_event_handling: 'Event Handling',
  skill_perc_databases: 'Databases',
  skill_perc_state_management: 'State Management',
  skill_perc_api_calls: 'API Calls',
  skill_perc_map_reduce: 'Map Reduce',
  eLinesPerc: 'Essential Lines Percentile',
  codeLongveityPerc: 'Code Longevity Percentile',
  totalEssentialLinesAdded: 'Total Essential Lines',
  linesRank: 'Line Count Rank',
  eLinesRank: 'Essential Line Count Rank',
  activeDayCount1mon: 'Active Days - 1 Month',
  activeDayCount6mon: 'Active Days - 6 Months',
  numRepos: 'Number of Repos',
  totalLinesAdded: 'Total Lines',
  percentEssentialCode: '% of Essential Lines',
  totalCommits: 'Total Commits',
  avgCodeSurvivalTime: 'Average Code Longevity',
  numLines1mon: 'Lines of Code - 1 Month',
  numLines6mon: 'Lines of Code - 6 Months',
  firstCommitDate: 'First Commit Date',
  codeLongevityRank: 'Code Longevity Rank',
  linesPerc: 'Total Lines Percentile',
};

const invertedMap = Object.entries(mapName).reduce((res, item) => {
  res[item[1]] = item[0];
  return res;
}, {});

const sortOptions = [
  'Top Skill',
  'Essential Lines Percentile',
  'Code Longevity Percentile',
  'Total Essential Lines',
  'Line Count Rank',
  'Essential Line Count Rank',
  'Active Days - 1 Month',
  'Active Days - 6 Months',
  'Number of Repos',
  'Total Lines',
  '% of Essential Lines',
  'Total Commits',
  'Average Code Longevity',
  'Lines of Code - 1 Month',
  'Lines of Code - 6 Months',
  'First Commit Date',
  'Code Longevity Rank',
  'Total Lines Percentile',
];

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

function SortableList({ tableDataState }) {
  const [tableData, setTableData] = tableDataState;
  const [sortChoice, setSortChoice] = useState(3);
  // const [tableData, setTableData] = useState(fixedData);
  const [changed, setChanged] = useState(false);
  const [
    queryVars,
    setQueryVars,
    queryRefetch,
    setIdList,
    setScrollerId,
  ] = useContext(SearchSortFilter);

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'Stat',
      dataIndex: 'stat',
      className: 'drag-visible',
      render: (item) => {
        return (
          <div>
            <Row gutter={[5]}>
              <Col span="10px">
                <Switch
                  size="small"
                  checked={item.enabled}
                  onChange={(checked) => {
                    console.log(checked);
                    const newTableData = tableData.map((dataItem) => {
                      if (dataItem.stat.name !== item.name) {
                        return dataItem;
                      }
                      dataItem.stat.enabled = checked;
                      return dataItem;
                    });
                    setTableData(newTableData);
                    setChanged(true);
                  }}
                />
              </Col>
              <Col span="auto">
                <Text ellipsis>{item.name}</Text>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Slider
                  tipFormatter={(val) => `${val}%`}
                  range
                  defaultValue={[0, 100]}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const dataSource = tableData;
    if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(dataSource),
        oldIndex,
        newIndex,
      ).filter((el) => !!el);
      console.log('Sorted items: ', newData);
      setTableData(newData);
      setChanged(true);
    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const dataSource = tableData;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps['data-row-key'],
    );
    return <SortableItem index={index} {...restProps} />;
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  function updateAllData() {
    const firstEnabled = tableData.find((dataItem) => dataItem.stat.enabled);
    console.log('firstEnabled', firstEnabled);
    const newQueryVars = {
      generalStatsAfter: null,
      generalStatsOrderBy: [
        {
          value: 'desc',
        },
      ],
      generalStatsWhere: {
        statType: {
          equals:
            sortChoice == 0
              ? invertedMap[firstEnabled.stat.name]
              : invertedMap[sortOptions[sortChoice]],
        },
      },
      generalStatsFirst: 10,
    };
    // delete newQueryVars.generalStatsAfter;
    // if (sortChoice == 0) {
    //   newQueryVars.generalStatsWhere.statType.equals =
    //     invertedMap[firstEnabled.stat.name];
    // } else {
    //   newQueryVars.generalStatsWhere.statType.equals = invertedMap[sortOptions[sortChoice]];
    // }
    console.log('newQueryVars', newQueryVars);

    setQueryVars(newQueryVars);
    console.log('updated queryVars', queryVars);
    setIdList(null);
    setScrollerId(nanoid());
    // console.log("scrollerRef.current", scrollerRef.current);
    // console.log("scrollerRef.current.key 1", scrollerRef.current.key);
    // scrollerRef.current.key = scrollerRef.current.key + 1;
    // console.log("scrollerRef.current.key 2", scrollerRef.current.key);
    // queryRefetch(queryVars);
    setChanged(false);
  }
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    float: 'left',
  };
  return (
    <div>
      <div>
        <Card
          type="inner"
          style={{
            margin: '16px',
          }}
          size="small"
          title="Sort By"
        >
          <Radio.Group
            value={sortChoice}
            onChange={(e) => {
              setSortChoice(e.target.value);
              setChanged(true);
            }}
          >
            {sortOptions.map((item, i) => {
              return (
                <Row>
                  <Radio style={radioStyle} value={i}>
                    {item}
                  </Radio>
                </Row>
              );
            })}
          </Radio.Group>
        </Card>
      </div>
      <div>
        <Table
          style={{
            margin: '16px',
          }}
          pagination={false}
          dataSource={tableData}
          columns={columns}
          rowKey="index"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </div>
      {changed && (
        <div>
          <Affix offsetBottom={10}>
            <Button type="primary" onClick={updateAllData}>
              Apply Changes
            </Button>
          </Affix>
        </div>
      )}
    </div>
  );
}

export default SortableList;
