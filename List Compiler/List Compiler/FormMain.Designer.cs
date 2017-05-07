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
            this.BtnBuild = new System.Windows.Forms.Button();
            this.TBLog = new System.Windows.Forms.RichTextBox();
            this.SuspendLayout();
            // 
            // LabelGitRoot
            // 
            this.LabelGitRoot.AutoSize = true;
            this.LabelGitRoot.Font = new System.Drawing.Font("SimSun", 10F);
            this.LabelGitRoot.Location = new System.Drawing.Point(11, 10);
            this.LabelGitRoot.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.LabelGitRoot.Name = "LabelGitRoot";
            this.LabelGitRoot.Size = new System.Drawing.Size(63, 14);
            this.LabelGitRoot.TabIndex = 0;
            this.LabelGitRoot.Text = "Git Root";
            // 
            // TBGitRoot
            // 
            this.TBGitRoot.Location = new System.Drawing.Point(78, 7);
            this.TBGitRoot.Margin = new System.Windows.Forms.Padding(2);
            this.TBGitRoot.Name = "TBGitRoot";
            this.TBGitRoot.Size = new System.Drawing.Size(795, 23);
            this.TBGitRoot.TabIndex = 1;
            // 
            // BtnBuild
            // 
            this.BtnBuild.Font = new System.Drawing.Font("SimSun", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.BtnBuild.Location = new System.Drawing.Point(10, 36);
            this.BtnBuild.Name = "BtnBuild";
            this.BtnBuild.Size = new System.Drawing.Size(862, 39);
            this.BtnBuild.TabIndex = 2;
            this.BtnBuild.Text = "Build";
            this.BtnBuild.UseVisualStyleBackColor = true;
            this.BtnBuild.Click += new System.EventHandler(this.BtnBuild_Click);
            // 
            // TBLog
            // 
            this.TBLog.Location = new System.Drawing.Point(10, 81);
            this.TBLog.Name = "TBLog";
            this.TBLog.Size = new System.Drawing.Size(862, 468);
            this.TBLog.TabIndex = 3;
            this.TBLog.Text = "";
            this.TBLog.WordWrap = false;
            this.TBLog.TextChanged += new System.EventHandler(this.TBLog_TextChanged);
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(884, 561);
            this.Controls.Add(this.TBLog);
            this.Controls.Add(this.BtnBuild);
            this.Controls.Add(this.TBGitRoot);
            this.Controls.Add(this.LabelGitRoot);
            this.Font = new System.Drawing.Font("SimSun", 10F);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Margin = new System.Windows.Forms.Padding(2);
            this.Name = "FormMain";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "List Compiler";
            this.Load += new System.EventHandler(this.FormMain_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label LabelGitRoot;
        private System.Windows.Forms.TextBox TBGitRoot;
        private System.Windows.Forms.Button BtnBuild;
        private System.Windows.Forms.RichTextBox TBLog;
    }
}

