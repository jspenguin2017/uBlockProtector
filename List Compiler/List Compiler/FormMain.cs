using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace List_Compiler
{
    public partial class FormMain : Form
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public FormMain()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Default git root directory
        /// </summary>
        private const string DefaultGitRoot = "C:\\Data\\Git\\AdBlockProtector";

        /// <summary>
        /// Form load event handler
        /// Set default git root
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FormMain_Load(object sender, EventArgs e)
        {
            TBGitRoot.Text = DefaultGitRoot;
        }

        /// <summary>
        /// Go button click handler
        /// Start compiling
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void BtnGo_Click(object sender, EventArgs e)
        {
            //Lock elements
            BtnGo.Enabled = false;
            TBGitRoot.Enabled = false;
            //Cache git root
            string gitRoot = TBGitRoot.Text;
            //Start main process
            await Task.Run(() =>
            {
                //Load to remove list (hard coded file name)
                string[] rmList;
                try
                {
                    rmList = File.ReadAllLines(Path.Combine(gitRoot, "List Compiler\\ListCompiler.ToRemove.txt"));
                    putLog("To remove list read, " + rmList.Length.ToString() + " entries found. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot read to remove list! Error message: ");
                    putLog(err.Message);
                    return;
                }
                //Load AAK List
                string[] originalAAKList;
                try
                {
                    originalAAKList = File.ReadAllLines(Path.Combine(gitRoot, "anti-adblock-killer\\anti-adblock-killer-filters.txt"));
                    putLog("Original AAK List read, " + originalAAKList.Length.ToString() + " entries found. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot read original AAK List! Error message: ");
                    putLog(err.Message);
                    return;
                }
                //Patch AAK List
                List<string> patchedAAKList = new List<string>();
                patchedAAKList.Add("! =====Patched AAK List=====");
                int commentCounter = 0;
                int removeCounter = 0;
                for (int i = 0; i < originalAAKList.Length; i++)
                {
                    string t = originalAAKList[i];
                    if (t == string.Empty || t[0] == '!')
                    {
                        //Skip comments
                        commentCounter++;
                    }
                    else if (rmList.Contains(t))
                    {
                        //Skip removed entries
                        removeCounter++;
                    }
                    else
                    {
                        //Put into patched list
                        patchedAAKList.Add(t);
                    }
                }
                putLog("Patching finished, " + commentCounter.ToString() + " comments skipped, " + removeCounter.ToString() + " entries removed. ");
                //Read main file
                string[] mainFile;
                try
                {
                    mainFile = File.ReadAllLines(Path.Combine(gitRoot, "List Compiler\\ListCompiler.Main.txt"));
                    putLog("Main file read, " + mainFile.Length.ToString() + " entries found. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot read main file! Error message: ");
                    putLog(err.Message);
                    return;
                }
                //Combine entries
                string[] toWrite = mainFile.Concat(patchedAAKList.ToArray()).ToArray();
                try
                {
                    File.WriteAllLines(Path.Combine(gitRoot, "AdBlockProtectorList.txt"), toWrite);
                    putLog("Compiling finished, " + toWrite.Length.ToString() + " entries wrote. ");
                }
                catch (Exception err)
                {
                    putLog("Cannot write to output file! Error message: ");
                    putLog(err.Message);
                    return;
                }
            });
            //Unlock elements
            BtnGo.Enabled = true;
            TBGitRoot.Enabled = true;
        }

        /// <summary>
        /// Write log into log textbox, a new line will be automatically added
        /// This method can be called from another thread
        /// </summary>
        /// <param name="msg">The message to write</param>
        private void putLog(string msg)
        {
            if (TBLog.InvokeRequired)
            {
                Invoke((MethodInvoker)(() =>
                {
                    TBLog.Text += msg + Environment.NewLine;
                }));
            }
            else
            {
                TBLog.Text += msg + Environment.NewLine;
            }
        }
    }
}
