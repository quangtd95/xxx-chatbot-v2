module.exports = {
	Account : function (data){
		this.ID = data.ID;
		this.HOTEN = data.HOTEN;
		this.SOTAIKHOAN = data.SOTAIKHOAN;
		this.SODIENTHOAI = data.SDT;
		this.MATKHAU = data.MATKHAU;
		this.CMND = data.CMND;
		this.TEN = String(this.HOTEN).substring(String(this.HOTEN).lastIndexOf(" "),String(this.HOTEN).length);	
	},
	Context : function(name,lifespan,params){
		this.name = name;
		this.lifespan = lifespan;
		this.parameters = params;
	}
}