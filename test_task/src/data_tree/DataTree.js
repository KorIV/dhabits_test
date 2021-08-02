import React, { useState } from 'react';
import axios from 'axios';
import { Tree } from 'antd';
import 'antd/dist/antd.css'

const { DirectoryTree } = Tree;

const initTreeData = [
  {
    title: 'Expand to load',
    key: '0',
  },
];

function updateTreeData(list, key, children) {
  return list.map((node) => {
    if (node.key === key) {
      return { ...node, children };
    }

    if (node.children) {
      return { ...node, children: updateTreeData(node.children, key, children) };
    }

    return node;
  });
}

function transformData(data){
  let newData = [];
  data.map((val, i, arr) => {
    if(val.children != undefined){
      newData.push({
        title: val.title,
        key: val.id,
        children: [],
      });
    } else {
      newData.push({
        title: val.title,
        key: val.id,
        isLeaf: true,
      })
    } 

  });

  return newData;
}

const DataTree = () => {
  const [treeData, setTreeData] = useState(initTreeData);

  function onLoadData({ key, children }) {
    console.log('key', key)
    return new Promise((resolve) => {
      // if (children) {
      //   resolve();
      //   return;
      // }

      const fetchData = async (key) => {
        if(key == 0){
          await axios
          .get(`http://164.90.161.80:3000/api/content`)
          .then((res) => {
            console.log('data', res.data);
            setTreeData((origin) =>
              updateTreeData(origin, key, transformData(res.data.children)));
            resolve();
          })
          .catch((err) => console.error(err));
        } else {
          await axios
            .get(`http://164.90.161.80:3000/api/content?dirId=${key}`)
            .then((res) => {
              console.log('data', res.data);
              setTreeData((origin) =>
                updateTreeData(origin, key, transformData(res.data.children)));
              resolve();
            })
            .catch((err) => console.error(err));
        }
      };
      
      fetchData(key);
    });
  }

  return <DirectoryTree loadData={onLoadData} treeData={treeData}/>;
};

export default DataTree;