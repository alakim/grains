var MockAsp = (function(){
	// ����� ���������� ������, ������������ ������� ��������
	var __ = {
		getPageContent: function(pgID){
			return pgID?{title:"Page "+pgID, content:"Page "+pgID+" content."}
				:{title:"Main page", content:"Main page content."};
		}
	};
	
	return __;
})();