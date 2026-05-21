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

function getQuotaName(quotaCode) {
  const quotaMap = {
    '9-230': '空气加热器（冷却器）安装',
    '9-233': '离心式通风机安装 风量4500m³/h以内',
    '9-234': '离心式通风机安装 风量10000m³/h以内',
    '9-235': '离心式通风机安装 风量20000m³/h以内',
    '9-236': '离心式通风机安装 风量50000m³/h以内',
    '9-237': '离心式通风机安装 风量123000m³/h以内',
    '9-238': '离心式通风机安装 风量123000m³/h以外',
    '9-239': '轴流式、斜流式、混流式通风机安装 风量8900m³/h以内',
    '9-240': '轴流式、斜流式、混流式通风机安装 风量25000m³/h以内',
    '9-241': '轴流式、斜流式、混流式通风机安装 风量63000m³/h以内',
    '9-242': '轴流式、斜流式、混流式通风机安装 风量140000m³/h以内',
    '9-243': '轴流式、斜流式、混流式通风机安装 风量140000m³/h以外',
    '9-247': '卫生间通风器安装',
    '9-248': '吊顶式空调器安装 质量0.15t以内',
    '9-251': '落地式空调器安装 质量1.0t以内',
    '9-254': '墙上式空调器安装 质量0.1t以内',
    '9-257': '组合式空调机组安装 风量4000m³/h以内',
    '9-258': '组合式空调机组安装 风量10000m³/h以内',
    '9-259': '组合式空调机组安装 风量20000m³/h以内',
    '9-260': '组合式空调机组安装 风量40000m³/h以内',
    '9-261': '组合式空调机组安装 风量60000m³/h以内',
    '9-262': '组合式空调机组安装 风量80000m³/h以内',
    '9-263': '组合式空调机组安装 风量100000m³/h以内',
    '9-264': '组合式空调机组安装 风量100000m³/h以外',
    '9-265': '风机盘管安装 落地式',
    '9-266': '风机盘管安装 吊顶式',
    '9-267': '风机盘管安装 壁挂式',
    '9-268': '风机盘管安装 卡式',
    '9-269': '变风量末端装置安装',
    '9-271': '组合式油烟净化机组安装 风量3000m³/h以内',
    '9-272': '组合式油烟净化机组安装 风量10000m³/h以内',
    '9-273': '组合式油烟净化机组安装 风量30000m³/h以内',
    '9-274': '组合式油烟净化机组安装 风量60000m³/h以内',
    '9-275': '除尘设备安装 质量100kg以内'
  };
  return quotaMap[quotaCode] || '';
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
      const quotaName = getQuotaName(quotaCode);
      const equipmentFee = getEquipmentFee(projectName, airVolume);
      const projectFeature = generateProjectFeature(projectName, airVolume);

      resultData.push({
        index: i,
        listCode,
        projectName,
        airVolume,
        fanType,
        quotaCode,
        quotaName,
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
      <td>${row.quotaName}</td>
      <td>${row.equipmentFee || ''}</td>
      <td>${row.unit}</td>
      <td>${row.quantity}</td>
      <td style="white-space: pre-line; text-align: left; padding: 8px;">${row.projectFeature}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 导出Excel（广联达可识别格式 - 每清单项3行：清单行/定额行/未计价材行）
document.getElementById('exportBtn').addEventListener('click', function() {
  if (!window.exportData || window.exportData.length === 0) {
    alert('没有数据可导出');
    return;
  }

  const wsData = [
    ['序号', '项目名称', '风量', '风机类型', '工程量', '项目编码', '', '名称', '项目特征', '单位', '工程量', '主材单价']
  ];

  window.exportData.forEach((row, idx) => {
    const itemNum = idx + 1; // 清单项序号（1,2,3...）
    const excelRow1 = wsData.length + 1; // 清单行Excel行号
    const excelRow2 = excelRow1 + 1;    // 定额行Excel行号
    const excelRow3 = excelRow1 + 2;    // 未计价材行Excel行号

    // ===== 第1行：清单行 =====
    wsData.push([
      itemNum,                            // A列：序号
      row.projectName,                    // B列：项目名称
      row.airVolume,                      // C列：风量
      row.fanType,                        // D列：风机类型
      row.quantity,                       // E列：工程量（数量）
      row.listCode,                       // F列：清单编码
      '清单行',                           // G列：固定"清单行"
      row.projectName,                    // H列：项目名称（同B列）
      row.projectFeature,                 // I列：项目特征
      row.unit,                           // J列：单位
      { f: `=E${excelRow1}` },            // K列：工程量（公式引用E列）
      row.equipmentFee || ''              // L列：主材单价（设备费）
    ]);

    // ===== 第2行：定额行 =====
    wsData.push([
      `${itemNum}.1`,                     // A列：序号.1
      '',                                 // B列：空
      '',                                 // C列：空
      '',                                 // D列：空
      '',                                 // E列：空
      row.quotaCode,                      // F列：定额编码
      '定额行',                           // G列：固定"定额行"
      row.quotaName,                      // H列：定额名称
      '',                                 // I列：空
      { f: `=J${excelRow1}` },            // J列：单位（公式引用上一行J列）
      { f: `=K${excelRow1}` },            // K列：工程量（公式引用上一行K列）
      ''                                  // L列：空
    ]);

    // ===== 第3行：未计价材行 =====
    wsData.push([
      `${itemNum}.2`,                     // A列：序号.2
      '',                                 // B列：空
      '',                                 // C列：空
      '',                                 // D列：空
      '',                                 // E列：空
      `Z00741-${String(itemNum).padStart(3, '0')}`, // F列：Z00741-001, Z00741-002...
      '未计价材行',                       // G列：固定"未计价材行"
      { f: `=H${excelRow1}` },            // H列：项目名称（公式引用清单行H列）
      '',                                 // I列：空
      { f: `=J${excelRow2}` },            // J列：单位（公式引用定额行J列）
      { f: `=K${excelRow2}` },            // K列：工程量（公式引用定额行K列）
      row.equipmentFee || ''              // L列：主材单价（设备费）
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '通风空调设备清单');
  XLSX.writeFile(wb, '通风空调设备清单定额结果.xlsx');
});