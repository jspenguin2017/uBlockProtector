namespace List_Compiler
{
    partial class FormMain
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.LabelGitRoot = new System.Windows.Forms.Label();
            this.TBGitRoot = new System.Windows.Forms.TextBox();
            this.BtnGo = new System.Windows.Forms.Button();
            this.TBLog = new System.Windows.Forms.RichTextBox();
            this.SuspendLayout();
            // 
            // LabelGitRoot
            // 
            this.LabelGitRoot.AutoSize = true;
            this.LabelGitRoot.Location = new System.Drawing.Point(7, 8);
            this.LabelGitRoot.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.LabelGitRoot.Name = "LabelGitRoot";
            this.LabelGitRoot.Size = new System.Drawing.Size(63, 14);
            this.LabelGitRoot.TabIndex = 0;
            this.LabelGitRoot.Text = "Git Root";
            // 
            // TBGitRoot
            // 
            this.TBGitRoot.Location = new System.Drawing.Point(73, 7);
            this.TBGitRoot.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.TBGitRoot.Name = "TBGitRoot";
            this.TBGitRoot.Size = new System.Drawing.Size(389, 23);
            this.TBGitRoot.TabIndex = 1;
            // 
            // BtnGo
            // 
            this.BtnGo.Location = new System.Drawing.Point(10, 36);
            this.BtnGo.Name = "BtnGo";
            this.BtnGo.Size = new System.Drawing.Size(451, 39);
            this.BtnGo.TabIndex = 2;
            this.BtnGo.Text = "Go";
            this.BtnGo.UseVisualStyleBackColor = true;
            this.BtnGo.Click += new System.EventHandler(this.BtnGo_Click);
            // 
            // TBLog
            // 
            this.TBLog.Location = new System.Drawing.Point(10, 81);
            this.TBLog.Name = "TBLog";
            this.TBLog.Size = new System.Drawing.Size(452, 348);
            this.TBLog.TabIndex = 3;
            this.TBLog.Text = "";
            this.TBLog.WordWrap = false;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(473, 441);
            this.Controls.Add(this.TBLog);
            this.Controls.Add(this.BtnGo);
            this.Controls.Add(this.TBGitRoot);
            this.Controls.Add(this.LabelGitRoot);
            this.Font = new System.Drawing.Font("宋体", 10F);
            this.Margin = new System.Windows.Forms.Padding(2, 2, 2, 2);
            this.Name = "FormMain";
            this.Text = "List Compiler";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label LabelGitRoot;
        private System.Windows.Forms.TextBox TBGitRoot;
        private System.Windows.Forms.Button BtnGo;
        private System.Windows.Forms.RichTextBox TBLog;
    }
}

