/*
 * summernote editor를 이용하기 위한 js
 */
$('#summernote').summernote({
	height: 400,                 // set editor height
	minHeight: null,             // set minimum height of editor
	maxHeight: null,             // set maximum height of editor
	focus: true,                 // set focus to editable area after initializing summernote
	placeholder: '게시글 내용을 입력해 주세요.(필수)',
	lang: "ko-KR"
	// ,
	// callbacks: {	//여기 부분이 이미지를 첨부하는 부분
	// 	onImageUpload: function(files) {
	// 		uploadImageFile(files[0], this);
	// 	}
	// }
});