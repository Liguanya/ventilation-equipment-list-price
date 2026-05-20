// 工具函数
function getListCode(projectName) {
  const name = projectName;
  // 1. 空气加热/冷却
  if (name.includes('空气加热') || name.includes('空气冷却')) {
    return '030701001';
  }
  // 2. 除尘/除污
  if (name.includes('除尘') || name.includes('除污')) {
    return '030701002';
  }
  // 4. 风机盘管
  if (name.includes('风机盘管') || name.includes('风盘')) {
    return '030701004';
  }
  // 5. 除湿
  if (name.includes('除湿')) {
    return '030701014';
  }
  // 6. 过滤吸收器
  if (name.includes('过滤吸收器')) {
    return '030701015';
  }
  // 7. 油烟
  if (name.includes('油烟')) {
    return '030701016';
  }
  // 8. 变风量
  if (name.includes('变风量')) {
    return '030701017';
  }
  // 3. 空调器类
  const acKeywords = ['分体空调', '室外机', '室内机', '空调机组', '新风', '空气幕', '组合式空调', '机组'];
  if (acKeywords.some(k => name.includes(k))) {
    return '030701003';
  }
  // 9. 通风机类
  const fanKeywords = ['送风', '排风', '补风', '排烟', '加压', '管道', '通风', '排气扇', '换气扇', '混流', '风机'];
  if (fanKeywords.some(k => name.includes(k))) {
    return '030701301';
  }
  return '';
}

function extractAirVolume(projectName) {
  const match = projectName.match(/(\d+)\s*m[3³]\/h/i);
  return match ? match[1] + 'm³/h' : '';
}

function generateProjectFeature(projectName, airVolume) {
  return `1.名称：${projectName}
2.规格：${airVolume || ''}
3.包含：减震装置、落地设备基础、吊装设备支吊架及除锈刷油
4.其他：满足招标图纸、招标文件、技术标准及相关图集规范要求`;
}

function getAirVolumeValue(airVolumeStr) {
  const match = airVolumeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getQuotaCode(projectName, fanType, airVolumeStr) {
  const name = projectName;
  const airVolume = getAirVolumeValue(airVolumeStr);

  // 1. 空气加热/冷却
  if (name.includes('空气加热') || name.includes('空气冷却')) {
    return '9-230';
  }

  // 4. 卫生间/排气扇
  if (name.includes('卫生间') || name.includes('排气扇') || name.includes('排风扇')) {
    return '9-247';
  }

  // 9. 除尘/除污
  if (name.includes('除尘') || name.includes('除污')) {
    return '9-275';
  }

  // 8. 油烟净化
  if (name.includes('油烟') || name.includes('净化')) {
    if (airVolume <= 3000) return '9-271';
    if (airVolume <= 10000) return '9-272';
    if (airVolume <= 30000) return '9-273';
    return '9-274';
  }

  // 6. 风机盘管
  if (name.includes('风机盘管') || name.includes('风盘')) {
    if (name.includes('落地')) return '9-265';
    if (name.includes('壁挂')) return '9-267';
    if (name.includes('卡式')) return '9-268';
    return '9-266';
  }

  // 7. 室内机/变风量末端
  if (name.includes('室内机') || name.includes('变风量末端') || name.includes('VAV') || name.includes('VRV')) {
    return '9-269';
  }

  // 5. 空调器类
  const isAC = ['分体空调', '室外机', '室内机', '空调机组', '新风', '空气幕', '组合式空调', '机组'].some(k => name.includes(k));
  if (isAC) {
    // 优先组合式
    if (name.includes('组合式') || name.includes('空调机组') || name.includes('机组')) {
      if (airVolume <= 4000) return '9-257';
      if (airVolume <= 10000) return '9-258';
      if (airVolume <= 20000) return '9-259';
      if (airVolume <= 40000) return '9-260';
      if (airVolume <= 60000) return '9-261';
      if (airVolume <= 80000) return '9-262';
      if (airVolume <= 100000) return '9-263';
      return '9-264';
    }
    // 安装方式
    if (name.includes('吊顶')) return '9-248';
    if (name.includes('落地')) return '9-251';
    if (name.includes('壁装') || name.includes('墙上')) return '9-254';
    return '9-251';
  }

  // 2、3. 风机类
  const isFan = ['送风', '排风', '补风', '排烟', '加压', '管道', '通风', '排气扇', '换气扇', '混流', '风机'].some(k => name.includes(k));
  if (isFan) {
    if (fanType === '离心风机' || fanType === '离心') {
      if (airVolume <= 4500) return '9-233';
      if (airVolume <= 10000) return '9-234';
      if (airVolume <= 20000) return '9-235';
      if (airVolume <= 50000) return '9-236';
      if (airVolume <= 123000) return '9-237';
      return '9-238';
    } else {
      if (airVolume <= 8900) return '9-239';
      if (airVolume <= 25000) return '9-240';
      if (airVolume <= 63000) return '9-241';
      if (airVolume <= 140000) return '9-242';
      return '9-243';
    }
  }

  return '';
}

function getEquipmentFee(projectName, airVolumeStr) {
  const name = projectName;
  const isFanType = ['送风', '排风', '补风', '排烟', '加压', '通风', '风机'].some(k => name.includes(k));
  if (isFanType) {
    const airVolume = getAirVolumeValue(airVolumeStr);
    return airVolume * 0.4;
  }
  return '';
}

// 处理Excel上传
document.getElementById('excelFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    // 处理数据（跳过表头，从第二行开始）
    const resultData = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      const projectName = row[0] || ''; // 第一列：风机信息/项目名称
      const fanType = row[1] || '';     // 第二列：风机类型
      const unit = row[2] || '台';      // 第三列：单位，无则默认台
      const quantity = row[3] || 1;     // 第四列：数量

      const listCode = getListCode(projectName);
      const airVolume = extractAirVolume(projectName);
      const quotaCode = getQuotaCode(projectName, fanType, airVolume);
      const equipmentFee = getEquipmentFee(projectName, airVolume);
      const projectFeature = generateProjectFeature(projectName, airVolume);

      resultData.push({
        index: i,
        listCode,
        projectName,
        airVolume,
        fanType,
        quotaCode,
        equipmentFee,
        unit,
        quantity,
        projectFeature
      });
    }

    // 渲染表格
    renderTable(resultData);
    document.getElementById('resultArea').style.display = 'block';

    // 保存数据用于导出
    window.exportData = resultData;
  };
  reader.readAsArrayBuffer(file);
});

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.index}</td>
      <td>${row.listCode}</td>
      <td>${row.projectName}</td>
      <td>${row.airVolume}</td>
      <td>${row.fanType}</td>
      <td>${row.quotaCode}</td>
      <td>${row.equipmentFee || ''}</td>
      <td>${row.unit}</td>
      <td>${row.quantity}</td>
      <td style="white-space: pre-line; text-align: left; padding: 8px;">${row.projectFeature}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 导出Excel
document.getElementById('exportBtn').addEventListener('click', function() {
  if (!window.exportData || window.exportData.length === 0) {
    alert('没有数据可导出');
    return;
  }

  const wsData = [
    ['序号', '清单编码', '项目名称', '风量', '风机类型', '定额编码', '设备费（元）', '单位', '数量', '项目特征']
  ];

  window.exportData.forEach(row => {
    wsData.push([
      row.index,
      row.listCode,
      row.projectName,
      row.airVolume,
      row.fanType,
      row.quotaCode,
      row.equipmentFee,
      row.unit,
      row.quantity,
      row.projectFeature
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '通风空调设备清单');
  XLSX.writeFile(wb, '通风空调设备清单定额结果.xlsx');
});